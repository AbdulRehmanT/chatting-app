"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Message from "@/components/Message";
import Sidebar from "@/components/sidebar";
import { useAuthContext } from "@/lib/AuthContext";
import {
  addDoc,
  collection,
  db,
  query,
  orderBy,
  onSnapshot,
  signOut,
  auth
} from "@/lib/firebase";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // Importing toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles

const Page = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, setUser } = useAuthContext() || {};

  const router = useRouter();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: any[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        userId: user?.uid,
        text: input,
        timestamp: new Date(),
      });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have successfully logged out!");

      if (setUser) {
        setUser(null);
      }

      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Error during logout. Please try again."); 
    }
  };

  return (
    <div className="bg-black w-full flex text-white h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="bg-gray-900 p-2 relative top-0 flex justify-between items-center">
          <h1 className="text-lg font-bold px-4 py-6">Group Chat</h1>
          <Button
            label="Logout"
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white rounded-lg flex items-center justify-center hover:from-[#ff4b2b] hover:to-[#ff416c] transition p-2"
          />
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              id={msg.id}
              senderId={msg.userId}
              userImage={msg.imageUrl || "default_image_url"}
              sender={msg.username}
              senderEmail={msg.senderEmail || "default@example.com"}
              text={msg.text}
              timestamp={msg.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-gray-900 p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="p-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none w-full"
            />
            <Button
              icon={<Send />}
              type="submit"
              className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white rounded-lg flex items-center justify-center hover:from-[#ff4b2b] hover:to-[#ff416c] transition p-2"
            />
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton /> {/* Toast Container */}
    </div>
  );
};

export default Page;
