// src/components/forms/SocialAuth.jsx
import { NormButton } from "./buttons";
// Здесь можно импортировать иконки из lucide-react или использовать SVG
// Например: import { Chrome } from "lucide-react";

export function SocialAuth() {
  const handleGoogleLogin = () => {
    console.log("Логика Google Auth");
    // window.location.href = 'api/auth/google';
  };

  return (
    <>
      <NormButton onClick={handleGoogleLogin} className="google-btn">
        Google
      </NormButton>
      {/* Можно добавить другие соцсети по такому же принципу */}
    </>
  );
}
