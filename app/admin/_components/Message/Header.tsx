import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
    return (
        <div className="p-2 border-b border-gray-300/20">
            <div className="flex items-center justify-between mb-4">
                <Link
                    href="/admin/messages"
                    className="flex items-center gap-2"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center ">
                        <Image
                            src={'/logo.png'}
                            alt="Logo"
                            width={40}
                            height={40}
                        />
                    </div>
                    <span className="font-bold">CheFu Academy</span>
                </Link>
            </div>
        </div>
    );
};

export default Header;
