import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout