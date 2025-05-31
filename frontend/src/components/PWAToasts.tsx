import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRegisterSW } from "virtual:pwa-register/react";

import { ReloadToast } from "@/components";
import { type SWNotificationDataType } from "@/types/types";

import styles from "@styles/components/PWAToasts.module.scss";

export const PWAToasts = () => {
  // check for updates every hour
  const period = 60 * 60 * 1000;

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", e => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  // handle beforeinstallprompt and appinstalled events
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;

    const handleAppInstalled = () => {
      console.log("App installed successfully");
      deferredPrompt = null;
      toast.dismiss("install-prompt");
      toast("App installed successfully!", {
        type: "success",
        autoClose: 5000,
      });
    };

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log("Install prompt triggered");
      e.preventDefault();
      deferredPrompt = e;

      const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        try {
          await deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;

          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
            handleAppInstalled();
          } else {
            console.log("User dismissed the install prompt");
          }

          toast.dismiss("install-prompt");
          deferredPrompt = null;
        } catch (error) {
          console.error("Error during install:", error);
          toast.dismiss("install-prompt");
        }
      };

      const InstallToast = () => {
        return (
          <div className={styles.installPrompt}>
            <p className={styles.installPromptText}>
              Install the app for a better experience!
            </p>
            <div className={styles.installPromptButtons}>
              <button type="button" onClick={handleInstallClick}>
                Install
              </button>
              <button
                type="button"
                onClick={() => toast.dismiss("install-prompt")}>
                Dismiss
              </button>
            </div>
          </div>
        );
      };

      toast(<InstallToast />, {
        type: "info",
        autoClose: false,
        closeButton: false,
        toastId: "install-prompt",
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Handle offline ready state
  useEffect(() => {
    if (offlineReady) {
      toast("App ready to work offline", {
        type: "info",
        autoClose: 5000,
        onClose: () => setOfflineReady(false),
      });
    }
  }, [offlineReady, setOfflineReady]);

  // Handle need refresh state
  useEffect(() => {
    if (needRefresh) {
      const reloadData: SWNotificationDataType = {
        title: "New content available",
        buttonText: "Reload",
        onConfirm: () => {
          updateServiceWorker(true);
          setNeedRefresh(false);
        },
      };

      toast(<ReloadToast {...reloadData} />, {
        type: "info",
        autoClose: false,
        closeButton: false,
        onClose: () => setNeedRefresh(false),
        toastId: "sw-update",
      });
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      const onlineData: SWNotificationDataType = {
        title: "You are back online!",
        buttonText: "Reload",
        onConfirm: () => location.reload(),
      };
      toast(<ReloadToast {...onlineData} />, {
        type: "success",
        autoClose: 5000,
        toastId: "online-status",
      });
    };

    const handleOffline = () => {
      toast("You are now offline! Some features may be limited.", {
        type: "warning",
        autoClose: 5000,
        toastId: "offline-status",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
};

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
