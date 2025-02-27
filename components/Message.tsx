import { useAuthContext } from "@/lib/AuthContext";

interface MessageProps {
  id: string;
  senderId: string;
  userImage: string;
  sender: string;
  senderEmail: string;
  text: string;
  timestamp: any; 
}

const Message: React.FC<MessageProps> = ({
  id,
  senderId,
  userImage,
  sender,
  senderEmail,
  text,
  timestamp,
}) => {
  const { user } = useAuthContext() || {}; // Get user from context

  // If no user, return null to avoid rendering message
  if (!user) return null;

  return (
    <div
      key={id}
      className={`flex ${senderId === user?.uid ? "justify-end" : "justify-start"}`}
    >
      {senderId !== user?.uid && (
        <img src={userImage} alt="User" className="w-8 h-8 rounded-full mr-2" />
      )}
      <div
        className={`p-3 rounded-lg text-sm shadow-md ${
          senderId !== user?.uid ? "bg-gray-800 text-gray-200" : "bg-green-700 text-white"
        } max-w-[80%] break-words`}
      >
        <p className="font-bold text-xs text-gray-400">
          {senderId === user?.uid
            ? "You"
            : sender || (senderEmail ? senderEmail.split("@")[0] : "Unknown")}
        </p>
        <p className="break-words">{text}</p>
        <small className="block text-right text-xs text-gray-400">
          {timestamp?.seconds
            ? new Date(timestamp.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : ""}
        </small>
      </div>
    </div>
  );
};

export default Message;
