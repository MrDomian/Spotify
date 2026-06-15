import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ERROR_MESSAGES = {
    OAuthSignin: "Nie udało się połączyć ze Spotify.",
    OAuthCallback:
        "Błąd callback OAuth. Najczęstsze przyczyny: zły Redirect URI w Spotify Dashboard, błędny Client Secret w Vercel, albo NEXTAUTH_URL nie pasuje do domeny.",
    OAuthCreateAccount: "Nie udało się utworzyć sesji.",
    AccessDenied:
        "Dostęp odrzucony. W Spotify Dashboard dodaj swój email do listy użytkowników aplikacji (Development mode).",
    Configuration:
        "Błąd konfiguracji serwera — brakuje JWT_SECRET, NEXTAUTH_URL lub danych Spotify w Vercel.",
    Default: "Wystąpił błąd logowania. Spróbuj ponownie.",
};

function Login() {
    const router = useRouter();
    const { error } = router.query;
    const [callbackUrl, setCallbackUrl] = useState(null);
    const [configOk, setConfigOk] = useState(null);

    useEffect(() => {
        fetch("/api/auth/check-config")
            .then((res) => res.json())
            .then((data) => {
                setConfigOk(data.ok);
                if (data.callbackUrl) {
                    setCallbackUrl(data.callbackUrl);
                }
            })
            .catch(() => {});

        fetch("/api/auth/providers")
            .then((res) => res.json())
            .then((providers) => {
                if (providers?.spotify?.callbackUrl) {
                    setCallbackUrl(providers.spotify.callbackUrl);
                }
            })
            .catch(() => {});
    }, []);

    const errorMessage = error
        ? ERROR_MESSAGES[error] || ERROR_MESSAGES.Default
        : null;

    return (
        <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center px-4">
            <img
                className="w-52 mb-5"
                src="https://links.papareact.com/9xl"
                alt=""
            />

            {errorMessage && (
                <div className="text-red-400 text-center mb-6 max-w-lg space-y-3">
                    <p>{errorMessage}</p>
                    {callbackUrl && (
                        <div className="text-gray-400 text-sm">
                            <p>Dodaj ten Redirect URI w Spotify Dashboard:</p>
                            <code className="block mt-2 p-2 bg-gray-900 rounded text-green-400 break-all">
                                {callbackUrl}
                            </code>
                        </div>
                    )}
                </div>
            )}

            {configOk === false && (
                <p className="text-yellow-400 text-center mb-4 max-w-lg text-sm">
                    Brakuje zmiennych środowiskowych na serwerze (Client ID,
                    Client Secret, JWT_SECRET lub NEXTAUTH_URL).
                </p>
            )}

            <button
                className="bg-[#18D860] text-white p-5 rounded-full"
                onClick={() => signIn("spotify", { callbackUrl: "/" })}
            >
                Login with Spotify
            </button>
        </div>
    );
}

export default Login;
