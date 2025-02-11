import { Link, useLocation } from "react-router-dom"

const Crumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x && x !== "provider");

  return (
    <nav className="text-sm">
      <ul className="flex space-x-2">
        <li>
          <Link
            to="/dashboard"
            className="text-green-dark font-semibold text-xl hover:text-green-600  transition-colors duration-200"
          >
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const routeTo = `/admin/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={index} className="flex items-center">
              <span className="text-green-dark mx-2">/</span>
              {isLast ? (
                <span className="text-green-dark text-lg font-semibold capitalize">
                  {value}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-green-dark text-lg font-semibold capitalize hover:text-green-600 transition-colors duration-200"
                >
                  {value}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Crumbs;
