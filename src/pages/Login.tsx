import { useAuthStore } from "../store/authStore";

import { useEffect, useState } from "react";
import LoginRight from "../components/login/LoginRight";
import { useGeneralContext } from "../context/GeneralContext";
import LoginLeft from "../components/login/LoginLeft";

type Props = {
  isHomePage: boolean;
};
export default function Login({ isHomePage }: Props) {
  const { setIsMenuOpened } = useGeneralContext();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activationCode, setActivationCode] = useState<string>("");
  const [errorPage, setErrorPage] = useState<string>("");

  const { setField } = useAuthStore();

  const handleActivationCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (activationCode === "") {
      setErrorPage("لطفا کد فعال‌ساز را وارد کنید");
      return;
    }
    setField("xCustomerCode", activationCode);
    setErrorPage("");
    setShowCodeModal(false);
  };

  useEffect(() => {
    setIsMenuOpened(true);
    console.log(errorPage);
  }, []);

  return (
    <div
      className="w-full h-screen flex justify-center overflow-hidden"
      dir="rtl"
    >
      {/* Right: Login card (now first for RTL) */}
      <LoginRight
        activationCode={activationCode}
        setActivationCode={setActivationCode}
        setShowCodeModal={setShowCodeModal}
        isHomePage={isHomePage}
      />
      {/* Left: Background image and logo */}
      {isHomePage && <LoginLeft />}
      {/* Activation code modal */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">تنظیم کد فعال‌ساز</h3>
            <form onSubmit={handleActivationCode}>
              <input
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="کد فعال‌ساز"
                dir="rtl"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCodeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  ذخیره
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
