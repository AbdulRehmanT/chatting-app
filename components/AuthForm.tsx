"use client";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setDoc,
  doc,
  db,
  getDoc,
  GoogleAuthProvider,
  signInWithPopup,
} from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  isSignup: boolean;
}

interface User {
  email: string;
  password: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignup }) => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      toast.info("Signing in with Google...");

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      console.log("User signed in with Google:", firebaseUser);

      if (isSignup) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", firebaseUser.uid), {
            username: firebaseUser.displayName || firebaseUser.email,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            imageUrl: firebaseUser.photoURL || "",
          });
          toast.success("User saved to Firestore");
        }
      }

      router.push("/chatroom");
      toast.success("Successfully signed in with Google!");
    } catch (err) {
      toast.error("Error with Google sign-in: " + (err instanceof Error ? err.message : err));
    }
  };

  const handleFacebook = () => {
    toast.warn("Coming Soon!");
  };

  const handleSMS = () => {
    toast.warn("Coming Soon!");
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const firebaseUser = userCredential.user;

      try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        });

        toast.success("User successfully signed up!");

        // After successful signup, route to the desired page (e.g., chatroom or dashboard)
        router.push("/chatroom");  // Change to another route if necessary
        toast.success("Redirecting to chatroom...");
      } catch (error) {
        toast.error("Error saving user to Firestore.");
      }
    } catch (err) {
      toast.error("Error creating user.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const firebaseUser = userCredential.user;

      console.log("User logged in:", firebaseUser);

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (userDoc.exists()) {
        router.push("/chatroom");
        toast.success("Successfully logged in!");
      } else {
        toast.error("No user data found.");
      }
    } catch (err) {
      toast.error("Error logging in: " + (err instanceof Error ? err.message : err));
    }
  };

  const authMethods = [
    {
      label: "Sign in with Google",
      iconSrc: "/google-logo.png",
      iconAlt: "google-icon",
      onClick: handleGoogle,
    },
    {
      label: "Sign in with Facebook",
      iconSrc: "/facebook-icon.png",
      iconAlt: "facebook-icon",
      onClick: handleFacebook,
    },
    {
      label: "Sign in with SMS",
      iconSrc: "/Phone.png",
      iconAlt: "phone-icon",
      onClick: handleSMS,
    },
  ];

  const inputFields = [
    {
      label: "Email",
      type: "email",
      value: user.email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setUser({ ...user, email: e.target.value }),
      placeholder: "m@example.com",
    },
    {
      label: "Password",
      type: "password",
      value: user.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setUser({ ...user, password: e.target.value }),
      placeholder: "password",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-4">
            {isSignup ? "Create an account" : "Log in to your account"}✨
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-center text-gray-400 mb-6">
            Welcome! Please enter your details.
          </p>

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            {inputFields.map((input, index) => (
              <Input
                key={index}
                label={input.label}
                onChange={input.onChange}
                placeholder={input.placeholder}
                type={input.type}
                value={input.value}
                className="w-full"
              />
            ))}
            <Button
              label={isSignup ? "Sign Up" : "Login"}
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] hover:from-[#ff4b2b] hover:to-[#ff416c]"
            />
          </form>

          {authMethods.map((method, index) => (
            <Button
              key={index}
              label={method.label}
              onClick={method.onClick}
              icon={
                <Image
                  src={method.iconSrc}
                  alt={method.iconAlt}
                  width={25}
                  height={25}
                />
              }
              className="w-full border border-gray-600 hover:bg-gradient-to-r hover:from-[#ff416c] hover:to-[#ff4b2b]"
            />
          ))}

          <p className="text-xs sm:text-sm text-center text-gray-400 cursor-pointer hover:underline">
            <Link href={isSignup ? "/auth/login" : "/auth/signup"}>
              {isSignup
                ? "Already have an account? Log in"
                : "Don't have an account? Signup"}
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default AuthForm;
