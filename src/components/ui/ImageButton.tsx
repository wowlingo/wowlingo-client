
interface ImageButtonProps {
    image: string;
    label: string;
    onClick: () => void;
}

const imageMap: Record<ImageButtonProps['image'], string> = {
    sound: '/images/ic_set_sound.png',
    slow: '/images/ic_set_slowly.png',
    repeat: '/images/ic_set_repeat.png',
};

export const ImageButton: React.FC<ImageButtonProps> = ({ image, label, onClick }) => {
    const imageSrc = imageMap[image];

    return (
        <button className="w-[150px] h-[99px] flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] hover:bg-gray-50  transition-colors"
            onClick={onClick}>
            <div className="w-10 h-10 flex items-center justify-center">
                <img src={imageSrc} alt={label} className="w-10 h-10" />
            </div>
            <span className="text-[16px] font-semibold text-[#4A5564] leading-[22.4px] tracking-[-0.32px]">
                {label}
            </span>
        </button>
    );
};

export default ImageButton;