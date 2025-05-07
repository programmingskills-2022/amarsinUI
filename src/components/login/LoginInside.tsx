import Login from "../../pages/Login";

const LoginInside = () => {

  return (
    <div className="w-full fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <Login isHomePage={false} />
    </div>
  );
};

export default LoginInside;
