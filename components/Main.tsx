import Skill from "./skill";

export default function Main() {
    return (
        <>
        <div className="ml-15 mr-15 pt-15 ">
            <h1 className="text-4xl font-bold mb-4">
                    About Me
                </h1>
        </div>
        <div className="ml-15 mr-15 flex justify-between items-center pb-15">

            <div className="w-1/2 flex justify-center items-center">
                <div className="avatar">
                    <div className="rounded-full w-60 h-60">
                        <img src="/icon.png" />
                    </div>
                </div>
            </div>
            <div className="w-1/2">
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
        </>
    )
}