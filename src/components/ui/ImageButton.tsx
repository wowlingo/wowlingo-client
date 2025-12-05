
interface ImageButtonProps {
    image: string;
    label: string;
    onClick: () => void;
}

const imageMap: Record<ImageButtonProps['image'], string> = {
    sound: '/images/sound_03.png',
    slow: '/images/slowly_04.png',
    repeat: '/images/ic_set_repeat.png',
    review: '/images/ic_set_add.png',
    pause: '/images/ic_set_pause.png',
};

export type ImageButtonType = keyof typeof imageMap;

interface ImageButtonProps {
    image: ImageButtonType;
    label: string;
    onClick: () => void;

    disabled?: boolean;
    isPlaying?: boolean;
    animationSrc?: string;

    className?: string;
}

export const ImageButton: React.FC<ImageButtonProps> = ({
    image,
    label,
    onClick,
    disabled = false,
    isPlaying = false,
    animationSrc,
    className = ""
}) => {
    // isPlaying이 true이고 animationSrc가 있으면 애니메이션 이미지를, 아니면 맵에 있는 기본 이미지를 사용
    const currentImageSrc = (isPlaying && animationSrc) ? animationSrc : imageMap[image];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={`
                flex flex-col items-center justify-center gap-[2px] px-[6px] py-[18px] transition-colors
                ${className} 
                ${disabled
                    ? 'cursor-not-allowed opacity-40 grayscale'
                    : 'hover:bg-gray-50 cursor-pointer'}
            `}
        >
            {/* 이미지 컨테이너 (너비를 22로 잡아 애니메이션 시 흔들림 방지) */}
            <div className="w-22 h-10 flex items-center justify-center">
                <img
                    src={currentImageSrc}
                    alt={label}
                    className="object-contain h-full"
                />
            </div>

            {/* 텍스트 라벨 */}
            <span className={`
                text-[16px] font-semibold leading-[22.4px] tracking-[-0.32px]
                ${disabled ? 'text-gray-300' : 'text-[#4A5564]'}
            `}>
                {label}
            </span>
        </button>
    );
};

export default ImageButton;