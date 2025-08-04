import { useState } from 'react'
import imgImage1 from "figma:asset/b4dc35558db2446c3a6a212c8b1f2715cf160156.png";
import imgImage4 from "figma:asset/14044ea94786a61d2a2fab07acb21d5cd884f06f.png";
import imgImage7 from "figma:asset/3651a4e1f658de6b6c3ea3f5f428383ef04062ab.png";
import imgImage8 from "figma:asset/2351d72b2dce335455b082e6badbb3cbe734afd9.png";
import imgImage9 from "figma:asset/03876a635551d2c620b11fb95d9c907cfd0174fe.png";
import imgImage24 from "figma:asset/bbda0857220be0da52034d82564c4f13c56e046f.png";
import imgImage27 from "figma:asset/7730eb4ac3a8270c00c0cf8d586e882aa80aca8c.png";

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { UserPlus, Monitor, Award, CalendarDays } from 'lucide-react'

interface OnlineProgram {
  id: string;
  englishTitle: string;
  chineseTitle: string;
  targetAudience: string[];
  courseLength: string[];
  expectedGoals: string[];
  interactivity: string;
  dataTools: string;
  valueAddedServices: string[];
  registrationMethod: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
}

const onlinePrograms: OnlineProgram[] = [
  {
    id: "mass-live-sessions",
    englishTitle: "Mass Live Sessions",
    chineseTitle: "常態線上課程",
    targetAudience: ["亞馬遜全階段賣家", "針對不同主題提供適合講座"],
    courseLength: ["直播", "1小時/堂"],
    expectedGoals: ["提供最新法規、功能資訊", "建立基礎營運知識"],
    interactivity: "低，主要為講師對學員的理論教學",
    dataTools: "無",
    valueAddedServices: ["無"],
    registrationMethod: ["GoTo Webinar 公開連結", "官網、帳戶經理分享"],
    difficulty: 'beginner',
    featured: true
  },
  {
    id: "export-ecommerce-certificate",
    englishTitle: "Export E-Commerce Talent Certificate Program",
    chineseTitle: "亞馬遜電商人才培育認證課程",
    targetAudience: ["學生、轉職者", "企業或服務商員工訓練"],
    courseLength: ["學習平台影音", "共15小時"],
    expectedGoals: ["提升業績表現", "建立營運數據分析與覆盤能力"],
    interactivity: "低，主要為講師對學員的理論教學",
    dataTools: "無",
    valueAddedServices: ["參與考前準備實體活動，享考證專屬優惠"],
    registrationMethod: ["IEAT 學習平台官網"],
    difficulty: 'intermediate'
  }
];

const comparisonRows = [
  { key: "targetAudience", label: "適合的\n賣家階段", icon: imgImage1 },
  { key: "courseLength", label: "課程長度", icon: imgImage4 },
  { key: "expectedGoals", label: "預期目標", icon: imgImage7 },
  { key: "interactivity", label: "實作性", icon: imgImage8 },
  { key: "dataTools", label: "數據整理\n小工具", icon: imgImage9 },
  { key: "valueAddedServices", label: "加值服務", icon: imgImage27 },
  { key: "registrationMethod", label: "報名方式", icon: imgImage24 }
];

interface OnlineProgramsProps {
  onRegister: (programId: string) => void;
  onViewSchedule: (programId: string) => void;
}

export function OnlinePrograms({ onRegister, onViewSchedule }: OnlineProgramsProps) {
  const getDifficultyBadge = (difficulty: string) => {
    const badgeProps = {
      beginner: { variant: 'secondary' as const, label: '初級' },
      intermediate: { variant: 'default' as const, label: '中級' },
      advanced: { variant: 'destructive' as const, label: '進階' }
    }
    return badgeProps[difficulty as keyof typeof badgeProps] || badgeProps.beginner
  }

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="mb-12">
        <div className="bg-[#dedede] border border-[#bdbdbd] rounded-[30px] px-6 py-4 inline-block">
          <h1 className="text-[15px] font-bold text-black">
            Live Broadcast (LB)
          </h1>
          <p className="text-[15px] font-normal text-black mt-1">線上課程</p>
        </div>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl">
          彈性的線上學習方案，隨時隨地提升您的亞馬遜銷售技能。
        </p>
      </div>

      {/* Statistics Cards for Online Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center gap-3">
            <Monitor className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-indigo-900">即時互動直播</h3>
              <p className="text-sm text-indigo-700">與專家即時問答交流</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">認證課程</h3>
              <p className="text-sm text-orange-700">完成課�����獲得官方認證</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="border border-[#bdbdbd] rounded-[30px] p-8 bg-white">
        {/* Program Headers */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div></div> {/* Empty cell for row labels */}
          {onlinePrograms.map((program) => (
            <div key={program.id} className="text-center">
              <div className="flex justify-center mb-2">
                <Badge {...getDifficultyBadge(program.difficulty)}>
                  {getDifficultyBadge(program.difficulty).label}
                </Badge>
                {program.featured && (
                  <Badge variant="outline" className="ml-2 border-yellow-400 text-yellow-700">
                    熱門
                  </Badge>
                )}
              </div>
              <h2 className="text-[18px] font-bold text-black mb-2">
                {program.englishTitle}
              </h2>
              <p className="text-[18px] font-medium text-black mb-4">
                {program.chineseTitle}
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => onViewSchedule(program.id)}
                  className="w-full"
                  variant="outline"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  查看課程時間
                </Button>
                <Button 
                  onClick={() => onRegister(program.id)}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  立即報名
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Rows */}
        {comparisonRows.map((row, index) => (
          <div key={row.key}>
            <div className="grid grid-cols-3 gap-8 py-6">
              {/* Row Label */}
              <div className="flex items-start gap-3">
                <div className="bg-[#cccccc] w-[7px] h-[27px] rounded-[20px] flex-shrink-0 mt-1"></div>
                <div
                  className="bg-center bg-cover bg-no-repeat w-6 h-6 flex-shrink-0 mt-1"
                  style={{ backgroundImage: `url('${row.icon}')` }}
                />
                <div className="text-[15px] font-bold text-black whitespace-pre-line">
                  {row.label}
                </div>
              </div>

              {/* Program Values */}
              {onlinePrograms.map((program) => (
                <div key={program.id} className="text-[15px] font-medium text-black">
                  {Array.isArray(program[row.key as keyof OnlineProgram]) ? (
                    <div className="space-y-1">
                      {(program[row.key as keyof OnlineProgram] as string[]).map((item, i) => (
                        <p key={i} className="leading-normal">{item}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="leading-normal whitespace-pre-line">
                      {program[row.key as keyof OnlineProgram] as string}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Divider Line (except for last row) */}
            {index < comparisonRows.length - 1 && (
              <div className="grid grid-cols-3 gap-8">
                <div></div>
                <div className="col-span-2 grid grid-cols-2 gap-8">
                  <div className="h-px bg-[#bdbdbd]"></div>
                  <div className="h-px bg-[#bdbdbd]"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}