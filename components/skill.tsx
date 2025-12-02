import React from 'react';
import type { Skill as SkillType } from '@/types/skill';

const skillData: SkillType[] = [
    {
        name: 'HTML',
        image: '/skill/html.png',
        comment: '直にHTMLをかくことは正直あまりないですが、かけます。',
    },
    
    {
        name: 'CSS',
        image: '/skill/css.png',
        comment: 'CSSも一応かけます、一時期Sassを使っていましたがいまではTailwind CSSを使っています。',
    },
    
    {
        name: 'Tailwind CSS',
        image: '/skill/tailwindcss.svg',
        comment: 'Tailwind CSSはとても便利です。DaisyUIとの組み合わせが最強',
    },

    {
        name: 'TypeScript',
        image: '/skill/typescript.png',
        comment: '勉強中の言語です。型安全の恩恵はまだあまり感じていませんが、感じれるようにつよつよになりたい。',
    },
    
    
    {
        name: 'React',
        image: '/skill/react.png',
        comment: 'React is a JavaScript library for building user interfaces.',
    },
    {
        name: 'NestJS',
        image: '/skill/nest.png',
        comment: 'NestJS is a framework for building server-side applications.',
    },
    {
        name: 'GNU/Linux',
        image: '/skill/linux.png',
        comment: 'GNU/Linux is a free and open source operating system.',
    },
];

const SkillCard = ({ skill }: { skill: SkillType }) => {
    return (
        <div className="card bg-base-100 shadow-sm h-full hover:shadow-lg transition-shadow">
            <figure className="px-6 pt-6 flex justify-center">
                <img
                    src={skill.image}
                    alt={skill.name}
                    className="w-24 h-24 object-contain"
                />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title text-lg font-semibold">{skill.name}</h2>
                <p className="text-sm text-base-content/80">{skill.comment}</p>
            </div>
        </div>
    );
};

export default function Skill() {
    return (
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl w-full">
                {skillData.map((skill) => (
                    <SkillCard key={skill.name} skill={skill} />
                ))}
            </div>
        </div>
    );
}