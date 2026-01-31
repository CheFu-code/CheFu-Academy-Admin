import Image from 'next/image';

const NoChatSelectedUI = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                <Image
                    src="/logo.png"
                    width={80}
                    height={80}
                    alt="Whisper Logo"
                    className=""
                />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to CheFu</h2>
            <p className="text-base-content/70 max-w-sm">
                Select a conversation from the sidebar or start a new chat to
                begin messaging
            </p>
        </div>
    );
};

export default NoChatSelectedUI;
