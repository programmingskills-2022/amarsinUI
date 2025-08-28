import SplashLogo from "../../assets/images/Splash-Logo.png";
import AmarsinSplash from "../../assets/images/AmarsinSplash.jpg";
import LogoBlack from "../../assets/images/logo-black.png";

const LoginLeft = () => {
  return (
    <div
      className="hidden md:flex w-[80%] h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${AmarsinSplash})` }}
    >
      <div className="flex flex-col items-start justify-start w-1/4 h-full pt-4">
        <img src={SplashLogo} />
      </div>
      <div className="flex flex-col h-full justify-end items-center w-1/2">
        <label className="w-full text-center p-2 bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-2">
          شما به کارتون برسید حساب کتابش با ما
        </label>
      </div>
      <div className="flex flex-col items-center justify-start h-full pt-8 mt-28 w-1/4">
        <img src={LogoBlack} />
        <div className="text-gray-500 text-sm pt-4">تحقیق </div>
        <div className="text-gray-500 text-sm">طراحی </div>
        <div className="text-gray-500 text-sm">توسعه </div>
        <div className="text-gray-500 text-sm">پشتیبانی</div>
      </div>
    </div>
  );
};

export default LoginLeft;
