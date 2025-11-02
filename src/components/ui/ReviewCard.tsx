import React from 'react';
import { ImageButton } from '../ui/ImageButton';
import { playAudio } from '../common/AudioService';

export const addVocabulary = (audioUrl: string) => {
    // 단어장 추가
    console.log(audioUrl);
};

interface ReviewCardProps {
    quest: string;
    unit: string;
    urlNormal: string;
    urlSlow: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ quest, unit, urlNormal, urlSlow }) => {
    return (
        <article
            className="rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 bg-white border border-gray-200"
        >
            <div className="p-5 sm:p-6 text-left">
                <p className="text-sm text-gray-600 font-medium mb-2">
                    {quest}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {unit}
                </h3>

                {/* <div className="grid grid-cols-3 gap-4 text-center"> 
                {/* <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-sm"></div> */}
                <div className="flex items-center justify-center rounded-xl overflow-hidden">
                    <ImageButton
                        image='sound'
                        label="문제 듣기"
                        onClick={() => playAudio(urlNormal)} />
                    <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
                    <ImageButton image='slow' label="천천히 듣기"
                        onClick={() => playAudio(urlSlow)} />
                    <div className="w-[1px] h-[67px] bg-[#E5E7EB]" />
                    <ImageButton image='review' label="단어장 추가"
                        onClick={() => addVocabulary(urlNormal)} />
                </div>
                {/* <div className="flex-shrink-0 px-5 pt-2 flex justify-center">
                    <Question key={mockSounds[0].id} sounds={mockSounds} />
                </div> */}
            </div>
        </article>
    );
};

