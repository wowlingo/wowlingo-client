import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { ImageButton } from '../ui/ImageButton';
import { playAudio, playLoopAudio } from '../common/AudioService';

interface WordCardProps {
    quest: string;
    unit: string;
    urlNormal: string;
    urlSlow: string;
}

export const WordCard: React.FC<WordCardProps> = ({ quest, unit, urlNormal, urlSlow }) => {
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
                    <ImageButton image='repeat' label="반복 듣기"
                        onClick={() => playLoopAudio(urlNormal)} />
                </div>
                {/* <div className="flex-shrink-0 px-5 pt-2 flex justify-center">
                    <Question key={mockSounds[0].id} sounds={mockSounds} />
                </div> */}
            </div>

            {/* 하단 완료 상태 */}
            <div
                className={`flex justify-between items-center p-4 mt-auto bg-gray-50`}
            >
                <span
                    className={`text-sm font-medium text-[#8E8E93]`}
                >
                    학습을 완료했어요
                </span>
                <button>
                    <CheckCircle className="text-gray-500" size={20} />
                </button>
            </div>
        </article>
    );
};

