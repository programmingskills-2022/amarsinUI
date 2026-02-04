import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/images/Logo.png";
import logoAvatar from "../../assets/images/logo-Avatar.png";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";
import { useGeneralContext } from "../../context/GeneralContext";
import packageJson from '../../../package.json'

type Props = {
  activationCode: string;
  setActivationCode: React.Dispatch<React.SetStateAction<string>>;
  setShowCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
  isHomePage: boolean;
};
const LoginRight = ({
  activationCode,
  setActivationCode,
  setShowCodeModal,
  isHomePage,
}: Props) => {
  const [errorPage, setErrorPage] = useState<string>("");

  const { login, isLoading } = useAuth();
  const {
    userName,
    pass,
    setField,
    message,
    errorCode,
    xCustomerCode,
    authApiResponse,
  } = useAuthStore();
  const { setSystemId, setYearId, setChartId, remember, setRemember } =
    useGeneralContext();

  const submitButtonRef = useRef<HTMLButtonElement>(null); // Create a ref for the button
  const initData = authApiResponse?.data.result.initData;

  useEffect(() => {
    // Set focus on the submit button when the component mounts
    if (submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
    setActivationCode(xCustomerCode);

    if (
      localStorage.getItem("auth-storage") === "" ||
      localStorage.getItem("auth-storage") === null ||
      remember === false
    ) {
      setShowCodeModal(true);
    }
  }, []);

  useEffect(() => {
    console.log(activationCode,"activationCode")
    if (errorCode !== -1) {
      setShowCodeModal(true);
    }
  }, [errorCode]);

  const handleLogin = (e: React.FormEvent) => {
    console.log("user", userName);
    e.preventDefault();
    setErrorPage("");

    if (userName === "" || pass === "") {
      setErrorPage("لطفا نام کاربری و رمز عبور را وارد کنید");
      return;
    }

    try {
      setField("appVer", packageJson.version)
      login();

      setSystemId(initData?.systemId ?? 0);
      setYearId(initData?.yearId ?? 0);
      setChartId(initData?.chartId ?? 0);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
    } finally {
      if (errorCode !== -1 && isLoading) {
        setShowCodeModal(true);
        return;
      }
    }
  };

  return (
    <div
      className={`${
        isHomePage ? "h-full" : "h-3/4"
      } w-full md:w-[20%] flex items-center justify-center bg-gray-100 rounded-xl`}
    >
      <div className={`h-full w-full max-w-sm p-2 flex flex-col items-center`}>
        <div className="w-full flex justify-start mb-2">
          <button
            onClick={() => setShowCodeModal(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>
        <div
          className={`w-full ${
            isHomePage ? "h-full" : "h-5/6"
          } flex flex-col items-center`}
        >
          {/* avatar here */}
          <img src={logoAvatar} />
          <div className="bg-gray-300 w-full h-full flex flex-col items-center rounded-xl pt-4 -m-5">
            <img src={Logo} />
            <label className="font-bold text-gray-700 text-base mt-6 mb-1">
              ورود کاربران سیستم جامع آمارسین
            </label>
            <form
              className="w-full flex flex-col gap-3 p-4"
              onSubmit={handleLogin}
            >
              <input
                type="text"
                value={userName}
                onChange={(e) => setField("userName", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="نام کاربری"
                dir="rtl"
              />
              <input
                type="password"
                value={pass}
                onChange={(e) => setField("pass", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="رمز عبور"
                autoComplete="current-password"
                dir="rtl"
              />
              <button
                type="submit"
                disabled={isLoading}
                ref={submitButtonRef} // Attach the ref to the button
                className="mt-2 w-full py-2 rounded border-2 border-red-500 text-red-600 font-bold text-lg bg-white hover:bg-red-50 transition disabled:opacity-50"
              >
                {isLoading ? "در حال ورود..." : "ورود"}
              </button>
            </form>
            <div className="w-full h-full flex flex-col items-center justify-between border-t-2 mt-2 border-gray-400 py-4">
              <div className="w-full flex items-center justify-center mt-2 border-gray-400">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="ml-2"
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-bold text-gray-700 cursor-pointer"
                >
                  اطلاعات ورود را بخاطر بسپار
                </label>
              </div>
              {errorCode !== -1 && (
                <div
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded w-full mb-2 text-center text-sm"
                  role="alert"
                >
                  {message}
                </div>
              )}
              {errorPage !== "" && (
                <div
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded w-full mb-2 text-center text-sm"
                  role="alert"
                >
                  {errorPage}
                </div>
              )}
              <label
                htmlFor="remember"
                className="text-xs font-bold text-gray-700 cursor-pointer"
              >
                www.dotis.ir
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRight;
