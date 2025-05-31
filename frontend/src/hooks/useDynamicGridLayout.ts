import { useCallback, useEffect, useState } from "react";
import { Layout, Layouts } from "react-grid-layout";

import { BREAKPOINTS } from "@/constants/constants";
import { Logbook } from "@/types/store/LogbookListSlice";

export const useDynamicGridLayout = (
  rowHeight: number = 150,
  initialLayouts: Layouts = {},
) => {
  const getCurrentBreakpoint = useCallback((): keyof typeof BREAKPOINTS => {
    if (typeof window === "undefined") return "lg";

    const width = window.innerWidth;
    if (width >= BREAKPOINTS.xxl.width) return "xxl";
    if (width >= BREAKPOINTS.xl.width) return "xl";
    if (width >= BREAKPOINTS.lg.width) return "lg";
    if (width >= BREAKPOINTS.md.width) return "md";
    return "sm";
  }, []);

  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<keyof typeof BREAKPOINTS>(getCurrentBreakpoint);

  const [layouts, setLayouts] = useState<Layouts>(() => {
    if (!initialLayouts || Object.keys(initialLayouts).length === 0) {
      return {
        xxl: [],
        xl: [],
        lg: [],
        md: [],
        sm: [],
      };
    }
    return initialLayouts;
  });

  const [contentHeights, setContentHeights] = useState<Record<string, number>>(
    {},
  );

  // Store original layouts to prevent overriding
  const [preservedLayouts, setPreservedLayouts] = useState<Layouts>({});

  const generateLayoutFromLogbooks = useCallback(
    (logbooks: Logbook[]): Layouts => {
      const createSimpleGridLayout = (cols: number) =>
        logbooks.map((logbook, index) => ({
          i: logbook.id,
          x: index % cols,
          y: Math.floor(index / cols),
          w: 1,
          h: 3,
          minW: 1,
          minH: 3,
        }));

      return Object.fromEntries(
        Object.entries(BREAKPOINTS).map(([breakpoint, values]) => [
          breakpoint,
          createSimpleGridLayout(values.cols),
        ]),
      );
    },
    [],
  );

  const initializeLayout = useCallback(
    (serverLayouts: Layouts | null, logbooks: Logbook[]) => {
      if (
        serverLayouts &&
        Object.values(serverLayouts).some(layout => layout.length > 0)
      ) {
        setLayouts(serverLayouts);
      } else if (logbooks && logbooks.length > 0) {
        const defaultLayouts = generateLayoutFromLogbooks(logbooks);
        setLayouts(defaultLayouts);
      } else {
        setLayouts({
          xxl: [],
          xl: [],
          lg: [],
          md: [],
          sm: [],
        });
      }
    },
    [generateLayoutFromLogbooks],
  );

  const updateLayoutsPreservingBreakpoints = useCallback(
    (newLayouts: Layouts, changedBreakpoint?: keyof typeof BREAKPOINTS) => {
      setLayouts(prevLayouts => {
        const updatedLayouts = { ...prevLayouts };

        if (changedBreakpoint) {
          // Only update the specific breakpoint that actually changed
          if (newLayouts[changedBreakpoint]) {
            updatedLayouts[changedBreakpoint] = newLayouts[changedBreakpoint];
          }
        } else {
          // If no specific breakpoint, only update non-empty layouts
          Object.entries(newLayouts).forEach(([breakpoint, layoutArray]) => {
            if (layoutArray && layoutArray.length > 0) {
              // Only update if this breakpoint doesn't exist or is empty
              if (
                !updatedLayouts[breakpoint as keyof typeof BREAKPOINTS] ||
                updatedLayouts[breakpoint as keyof typeof BREAKPOINTS]
                  .length === 0
              ) {
                updatedLayouts[breakpoint as keyof typeof BREAKPOINTS] =
                  layoutArray;
              }
            }
          });
        }

        return updatedLayouts;
      });
    },
    [],
  );

  // Track when layouts are being set to preserve them
  const setLayoutsWithPreservation = useCallback(
    (newLayouts: Layouts | ((prev: Layouts) => Layouts)) => {
      if (typeof newLayouts === "function") {
        setLayouts(prevLayouts => {
          const result = newLayouts(prevLayouts);
          setPreservedLayouts(result);
          return result;
        });
      } else {
        setLayouts(newLayouts);
        setPreservedLayouts(newLayouts);
      }
    },
    [],
  );

  const ensureLayoutForBreakpoint = useCallback(
    (breakpoint: keyof typeof BREAKPOINTS, logbooks: Logbook[]) => {
      setLayouts(prevLayouts => {
        if (prevLayouts[breakpoint] && prevLayouts[breakpoint].length > 0) {
          return prevLayouts;
        }

        // Generate default layout for this specific breakpoint
        const cols = BREAKPOINTS[breakpoint].cols;
        const newLayout = logbooks.map((logbook, index) => ({
          i: logbook.id,
          x: index % cols,
          y: Math.floor(index / cols),
          w: 1,
          h: 3,
          minW: 1,
          minH: 3,
        }));

        return {
          ...prevLayouts,
          [breakpoint]: newLayout,
        };
      });
    },
    [],
  );

  const updateContentHeight = useCallback(
    (id: string, pixelHeight: number) => {
      const gridUnits = Math.ceil(pixelHeight / rowHeight);
      setContentHeights(prev => {
        if (prev[id] !== gridUnits) {
          return { ...prev, [id]: gridUnits };
        }
        return prev;
      });
    },
    [rowHeight],
  );

  const getLayoutWithDynamicHeight = useCallback(
    (id: string): Layout => {
      const defaultLayout: Layout = {
        i: id,
        x: 0,
        y: 0,
        w: 1,
        h: 3,
        minW: 1,
        minH: 3,
      };

      let foundLayout: Layout | undefined;

      if (currentBreakpoint && layouts?.[currentBreakpoint]?.length > 0) {
        foundLayout = layouts[currentBreakpoint].find(item => item.i === id);
      }

      const baseLayout = foundLayout || defaultLayout;

      const contentHeight = contentHeights[id];
      if (contentHeight) {
        const dynamicMinH = Math.max(3, contentHeight);
        return {
          ...baseLayout,
          minH: dynamicMinH,
          h: Math.max(baseLayout.h, dynamicMinH),
        };
      }

      return baseLayout;
    },
    [layouts, contentHeights, currentBreakpoint],
  );

  // Enhanced breakpoint change handler that preserves layouts
  const handleBreakpointChange = useCallback(
    (newBreakpoint: keyof typeof BREAKPOINTS, logbooks?: Logbook[]) => {
      setCurrentBreakpoint(newBreakpoint);

      if (
        logbooks &&
        (!layouts[newBreakpoint] || layouts[newBreakpoint].length === 0)
      ) {
        ensureLayoutForBreakpoint(newBreakpoint, logbooks);
      }
    },
    [layouts, ensureLayoutForBreakpoint],
  );

  useEffect(() => {
    if (Object.keys(contentHeights).length > 0 && currentBreakpoint) {
      setLayouts(prevLayouts => {
        const updatedLayouts = { ...prevLayouts };

        // Only update the current breakpoint
        if (updatedLayouts[currentBreakpoint]) {
          updatedLayouts[currentBreakpoint] = updatedLayouts[
            currentBreakpoint
          ].map(item => {
            const contentHeight = contentHeights[item.i];
            if (contentHeight) {
              const newMinH = Math.max(3, contentHeight);
              return {
                ...item,
                minH: newMinH,
                h: Math.max(item.h, newMinH),
              };
            }
            return item;
          });
        }

        return updatedLayouts;
      });
    }
  }, [contentHeights, currentBreakpoint]);

  return {
    layouts,
    setLayouts: setLayoutsWithPreservation,
    updateLayoutsPreservingBreakpoints,
    updateContentHeight,
    getLayoutWithDynamicHeight,
    initializeLayout,
    setCurrentBreakpoint: handleBreakpointChange,
    currentBreakpoint,
    ensureLayoutForBreakpoint,
    preservedLayouts,
  };
};
