"use client";
import { useRouter } from "next/navigation";
import { auth, onAuthStateChanged,doc,db,getDoc, } from '@/lib/firebase';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type UserType = {
    username?: string,
    email: string,
    uid: string,
    imageUrl:string
}

type ChildrenType = {
  children: ReactNode;
};

type ContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

const AuthContext = createContext<ContextType | null>(null);

export default function AuthContextProvider({ children }: ChildrenType) {
  const [user, setUser] = useState<UserType | null>(null);

  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchuserData(uid);
        router.push('/chatroom')
      } else {
        setUser(null);
        router.push('/auth/login')
      }
    });
  }, []);

  const fetchuserData = async (uid: string) => {
    let docRef = doc(db, "users", uid);
    try {
      let userFound = await getDoc(docRef);
      let user = userFound.data();

      if (!user) return;

      setUser({
        uid: user.uid,
        email: user.email,
        username: user.username,
        imageUrl: user.imageUrl,
      });
    } catch (e) {
      console.error("error:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);