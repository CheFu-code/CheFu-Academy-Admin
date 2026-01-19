const Loading = ({ message }: { message: string }) => {
    return (
        <div className="text-center font-bold mt-9 justify-center items-center flex-col flex h-full">
            <p className="animate-bounce text-green-500">{message}</p>
        </div>
    );
};

export default Loading;
