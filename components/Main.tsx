'use client';

import { useState, useEffect } from 'react';
import Skill from "./skill";
import Card from "./Card";
import type { Health } from '@/types/health';

export default function Main() {
    const [healthData, setHealthData] = useState<Health | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHealthData() {
            try {
                const response = await fetch('/api/health');
                const data: Health = await response.json();
                setHealthData(data);
            } catch (error) {
                console.error('Failed to fetch health data:', error);
                setHealthData({ steps: 0, sleepTime: 0 });
            } finally {
                setLoading(false);
            }
        }

        fetchHealthData();
    }, []);

    return (
        <>
        <div className="ml-15 mr-15 pt-15 ">
            <h1 className="text-4xl font-bold mb-4">
                    About Me
                </h1>
        </div>
        <div className="ml-15 mr-15 grid gap-8 items-center pb-15 md:grid-cols-2">
            <div className="flex justify-center">
                <div className="avatar">
                    <div className="rounded-full w-60 h-60">
                        <img src="/icon.png" />
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-bold mb-4">Hello World!</h2>
                <p className="text-lg">東京にある情報系の学部に所属しています。</p>
                <p className="text-lg">最近はプログラミングやGNU/Linuxに興味を持っています。</p>
                <p className="text-lg">趣味はカメラや音楽、ガジェットなど沢山あるため器用貧乏です。</p>
            </div>
        </div>
        <div className="ml-15 mr-15 skills pt-15 pb-15">
            <h1 className="text-4xl font-bold mb-4">
                Skills
            </h1>
            <Skill />
        </div>
        <div className="flex justify-center items-center py-15 min-h-96 px-15">
            {loading ? (
                <div className="w-full max-w-4xl">
                    <Card content={<div className="text-4xl font-bold mb-4 text-center py-8">読み込み中...</div>} />
                </div>
            ) : healthData && (
                <div className="w-full max-w-4xl">
                    <Card content={
                        <div className="p-10">
                            <h2 className="text-3xl font-bold mb-8 text-center">健康データ</h2>
                            <div className="space-y-6 text-center">
                                <p className="text-2xl">歩数: {healthData.steps.toLocaleString()} 歩</p>
                                <p className="text-2xl">睡眠時間: {healthData.sleepTime} 時間</p>
                            </div>
                        </div>
                    } />
                </div>
            )}
        </div>
        </>
    )
}