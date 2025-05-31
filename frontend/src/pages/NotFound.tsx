import { type FC } from "react";
import { NavLink } from "react-router-dom";

import styles from "@/styles/pages/NotFound.module.scss";

export const NotFound: FC = () => {
  return (
    <main>
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundErrorCode}>404</h1>
        <h2 className={styles.notFoundErrorName}>Page not found</h2>
        <p className={styles.notFoundErrorDescription}>
          Unfortunately, this is only a 404 page. You may have mistyped the
          address, or the page has been moved to another URL.
        </p>
        <NavLink to="/">
          <span className={styles.notFoundReturnLink}>Back to home page</span>
        </NavLink>
      </div>
    </main>
  );
};
