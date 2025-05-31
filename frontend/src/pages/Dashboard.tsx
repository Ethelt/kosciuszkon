import {
  type FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import EditIcon from "@assets/icons/penToSquareSolid.svg?react";
import CancelIcon from "@assets/icons/xmarkSolid.svg?react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";

import { DashboardCard, ResizableHandle } from "@/components";
import { BREAKPOINTS, DASHBOARD_CARD_ROW_HEIGHT } from "@/constants/constants";
import { useDynamicGridLayout } from "@/hooks/useDynamicGridLayout";
import { StoreContext } from "@/main";

import styles from "@styles/pages/Dashboard.module.scss";

export const Dashboard: FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const {
    layouts,
    setLayouts,
    updateContentHeight,
    getLayoutWithDynamicHeight,
    initializeLayout,
    setCurrentBreakpoint,
    currentBreakpoint,
    preservedLayouts,
  } = useDynamicGridLayout(DASHBOARD_CARD_ROW_HEIGHT);

  const store = useContext(StoreContext);
  const { storeLayouts, widgets } = store.DashboardLayoutState;

  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  useEffect(() => {
    if (!widgets.length) return;
    initializeLayout(storeLayouts, widgets);
  }, [storeLayouts, widgets, initializeLayout]);

  // Enhanced layout change handler that only updates current breakpoint
  const handleLayoutChange = useCallback(
    (currentLayout: Layout[]) => {
      if (currentLayout.length === 0 || !currentBreakpoint) return;

      const updatedLayouts = { ...layouts };
      updatedLayouts[currentBreakpoint] = currentLayout;

      // Restore other breakpoints from preserved layouts
      Object.keys(BREAKPOINTS).forEach(bp => {
        const breakpoint = bp as keyof typeof BREAKPOINTS;
        if (breakpoint !== currentBreakpoint && preservedLayouts[breakpoint]) {
          updatedLayouts[breakpoint] = preservedLayouts[breakpoint];
        }
      });

      setLayouts(updatedLayouts);
    },
    [layouts, currentBreakpoint, preservedLayouts, setLayouts],
  );

  const handleBreakpointChange = useCallback(
    (breakpoint: keyof typeof BREAKPOINTS) => {
      // Preserve current layout before switching
      if (currentBreakpoint && layouts[currentBreakpoint]) {
        setLayouts(prev => ({
          ...prev,
          [currentBreakpoint]: layouts[currentBreakpoint],
        }));
      }

      setCurrentBreakpoint(breakpoint, widgets);
    },
    [setCurrentBreakpoint, widgets, currentBreakpoint, layouts, setLayouts],
  );

  const layoutsRef = useRef<Layouts>(layouts);

  useEffect(() => {
    layoutsRef.current = layouts;
  }, [layouts]);

  const gridLayouts = useMemo(() => {
    if (!currentBreakpoint || !layouts[currentBreakpoint]) {
      return {};
    }

    return {
      [currentBreakpoint]: layouts[currentBreakpoint],
    };
  }, [layouts, currentBreakpoint]);

  useEffect(() => {
    if (!layouts || Object.keys(layouts).length === 0) return;
    // console.log("Current layouts:", layouts);
    // console.log("Current breakpoint:", currentBreakpoint);
  }, [layouts, currentBreakpoint]);

  return (
    <>
      <div className={styles.dashboardList}>
        <ResponsiveGridLayout
          className={`${styles.dashboardGrid} ${
            isEditMode ? styles.dashboardEditGrid : ""
          }`}
          layouts={gridLayouts} // Use filtered layouts
          onLayoutChange={handleLayoutChange}
          rowHeight={DASHBOARD_CARD_ROW_HEIGHT}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          resizeHandle={<ResizableHandle />}
          onBreakpointChange={handleBreakpointChange}
          transformScale={1}
          // compactType={currentBreakpoint === "sm" ? "vertical" : null}
          // preventCollision={currentBreakpoint !== "sm"}
          cols={{ xxl: 6, xl: 4, lg: 3, md: 2, sm: 1 }}
          breakpoints={{ xxl: 1536, xl: 1200, lg: 992, md: 768, sm: 600 }}>
          {widgets &&
            widgets.map(element => {
              return (
                <div
                  className={styles.dashboardListElement}
                  key={element.id}
                  data-grid={getLayoutWithDynamicHeight(element.id)}>
                  <DashboardCard
                    {...element}
                    isEditMode={isEditMode}
                    onHeightChange={updateContentHeight}
                  />
                </div>
              );
            })}
        </ResponsiveGridLayout>
        <button
          title="Edit layout"
          type="button"
          className={styles.dashboardEdit}
          onClick={() => setIsEditMode(prev => !prev)}>
          {isEditMode ? (
            <CancelIcon className={styles.dashboardEditIcon} />
          ) : (
            <EditIcon className={styles.dashboardEditIcon} />
          )}
        </button>
      </div>
    </>
  );
};
