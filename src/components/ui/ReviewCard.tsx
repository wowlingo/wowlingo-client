import React from 'react';
import { ImageButton } from '../ui/ImageButton';
import { playAudio, playAudios } from '../common/AudioService'
import { toast } from 'sonner';
import { ToastBlueIcon } from './WordCard';


interface ReviewCardProps {
    // questId: number;
    title: string;
    // type: string;
    questItemId: number;
    sounds: { id: number; type: string; url: string }[];
    units: string[];
    answer?: string | number | null;
    onAddVoca: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ title, questItemId, sounds, units, onAddVoca }) => {

    console.log(units);
    const addVocabulary = (questItemId: number) => {
        console.log(questItemId);

        onAddVoca();

        toast("단어장에 추가 되었습니다", {
            icon: <ToastBlueIcon />,
            duration: 3000,
        });

    };

    const handlePlay = (type: 'normal' | 'slow') => {
        const soundUrls = sounds.filter(s => s.type === type).map(s => s.url);

        if (soundUrls.length > 1) {
            playAudios(soundUrls);
        } else if (soundUrls.length === 1) {
            playAudio(soundUrls[0]);
        }
    };

    return (
        <article
            className="rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 bg-white border border-gray-200"
        >
            <div className="p-5 sm:p-6 text-left">
                <p className="text-sm text-gray-600 font-medium mb-2">
                    {title}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {Array.isArray(units) ? units.join(' - ') : units || ''}
                </h3>

                {/* <div className="grid grid-cols-3 gap-4 text-center"> 
                {/* <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm"></div> */}
                <div className="flex items-center justify-center rounded-xl overflow-hidden">
                    <ImageButton
                        image='sound'
                        label="문제 듣기"
                        onClick={() => handlePlay('normal')} />
                    <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
                    <ImageButton image='slow' label="천천히 듣기"
                        onClick={() => handlePlay('slow')} />
                    <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
                    <ImageButton image='review' label="단어장 추가"
                        onClick={() => addVocabulary(questItemId)} />
                </div>
                {/* <div className="flex-shrink-0 px-5 pt-2 flex justify-center">
                    <Question key={mockSounds[0].id} sounds={mockSounds} />
                </div> */}
            </div>
        </article>
    );
};

