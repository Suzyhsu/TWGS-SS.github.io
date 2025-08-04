import { useState, useMemo } from 'react'
import imgImage1 from "figma:asset/b4dc35558db2446c3a6a212c8b1f2715cf160156.png";
import imgImage4 from "figma:asset/14044ea94786a61d2a2fab07acb21d5cd884f06f.png";
import imgImage7 from "figma:asset/3651a4e1f658de6b6c3ea3f5f428383ef04062ab.png";
import imgImage8 from "figma:asset/2351d72b2dce335455b082e6badbb3cbe734afd9.png";
import imgImage9 from "figma:asset/03876a635551d2c620b11fb95d9c907cfd0174fe.png";
import imgImage24 from "figma:asset/bbda0857220be0da52034d82564c4f13c56e046f.png";
import imgImage27 from "figma:asset/7730eb4ac3a8270c00c0cf8d586e882aa80aca8c.png";

import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { RegistrationForm } from './components/RegistrationForm'

import { OnlinePrograms } from './components/OnlinePrograms'
import Comparison from './imports/Comparison'
import { Calendar, Users, Clock, Target, Activity, Gift, UserPlus, Monitor, MapPin, CalendarDays, Mail, BarChart3 } from 'lucide-react'

interface TrainingProgram {
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
  featured?: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  inviteOnly?: boolean;
}

const offlinePrograms: TrainingProgram[] = [
  {
    id: "turbo-bootcamp",
    englishTitle: "Turbo Bootcamp",
    chineseTitle: "銷量引爆特訓營",
    targetAudience: ["已完成帳戶註冊，選品", "的亞馬遜新手賣家"],
    courseLength: ["一梯週期約 30 天", "共 4 堂系列課"],
    expectedGoals: ["出1單"],
    interactivity: "高，學員跟隨課程實作",
    dataTools: "無",
    valueAddedServices: ["OB 團隊現場諮詢", "物流服務商現場諮詢"],
    registrationMethod: ["ACCUPASS 公開連結", "官網、帳戶經理分享"],
    featured: true,
    difficulty: 'beginner'
  },
  {
    id: "basic-theme",
    englishTitle: "Basic Theme Course",
    chineseTitle: "基礎主題單堂課",
    targetAudience: ["已完成銷量引爆特訓營賣家", "想把特定主題基礎打穩的新手賣家"],
    courseLength: ["單日", "3小時/堂"],
    expectedGoals: ["建立基礎營運知識"],
    interactivity: "較低，主要為講師對學員的理論教學",
    dataTools: "無",
    valueAddedServices: ["無"],
    registrationMethod: ["ACCUPASS 公開連結", "官網、帳戶經理分享"],
    difficulty: 'beginner'
  },
  {
    id: "advanced-theme",
    englishTitle: "Sales Plus Theme Course",
    chineseTitle: "進階主題單堂課",
    targetAudience: ["已經出單並有成長潛力的資深賣家", "符合團隊訂定邀請條件的賣家"],
    courseLength: ["單日", "3小時/堂"],
    expectedGoals: ["提升業績表現", "建立營運數據分析與覆盤能力"],
    interactivity: "中等，學員進行課堂數據演練",
    dataTools: "有",
    valueAddedServices: ["免費使用數據整理工具", "特定課程提供服務商現場諮詢"],
    registrationMethod: ["ACCUPASS 非公開連結", "帳戶經理邀請"],
    difficulty: 'advanced',
    inviteOnly: true
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

interface FilterState {
  searchTerm: string
  targetAudience: string
  courseLength: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

// Combined program data for registration lookup
const allPrograms = [
  ...offlinePrograms,
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
    difficulty: 'beginner' as const,
    featured: true,
    inviteOnly: false
  },
  {
    id: "export-ecommerce-certificate",
    englishTitle: "Export E-Commerce Talent Certificate Program",
    chineseTitle: "亞馬遜電商人才培育認證課程",
    targetAudience: ["學生、轉職者", "企業或服務商員教育訓練"],
    courseLength: ["學習平台影音", "共15小時"],
    expectedGoals: ["提升業績表現", "建立營運數據分析與覆盤能力"],
    interactivity: "低，主要為講師對學員的理論教學",
    dataTools: "無",
    valueAddedServices: ["參與考前準備實體活動，享考證專屬優惠"],
    registrationMethod: ["IEAT 學習平台官網"],
    difficulty: 'intermediate' as const,
    inviteOnly: false
  }
]

export default function App() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('comparison')
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    targetAudience: '',
    courseLength: '',
    sortBy: 'none',
    sortOrder: 'asc'
  })

  // Filter and sort programs (for offline programs only, online programs don't use filters)
  const filteredAndSortedPrograms = useMemo(() => {
    let filtered = [...offlinePrograms]

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(program =>
        program.englishTitle.toLowerCase().includes(searchTerm) ||
        program.chineseTitle.toLowerCase().includes(searchTerm) ||
        program.targetAudience.some(audience => audience.toLowerCase().includes(searchTerm)) ||
        program.expectedGoals.some(goal => goal.toLowerCase().includes(searchTerm)) ||
        program.interactivity.toLowerCase().includes(searchTerm)
      )
    }

    // Apply target audience filter
    if (filters.targetAudience) {
      filtered = filtered.filter(program =>
        program.targetAudience.some(audience => 
          audience.includes(filters.targetAudience)
        )
      )
    }

    // Apply course length filter
    if (filters.courseLength) {
      filtered = filtered.filter(program =>
        program.courseLength.some(length => 
          length.includes(filters.courseLength)
        )
      )
    }

    // Apply sorting
    if (filters.sortBy && filters.sortBy !== 'none') {
      filtered.sort((a, b) => {
        let aValue: string
        let bValue: string

        switch (filters.sortBy) {
          case 'title':
            aValue = a.chineseTitle
            bValue = b.chineseTitle
            break
          case 'audience':
            aValue = a.targetAudience[0] || ''
            bValue = b.targetAudience[0] || ''
            break
          case 'length':
            aValue = a.courseLength[0] || ''
            bValue = b.courseLength[0] || ''
            break
          case 'interactivity':
            aValue = a.interactivity
            bValue = b.interactivity
            break
          default:
            return 0
        }

        const comparison = aValue.localeCompare(bValue, 'zh-TW')
        return filters.sortOrder === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [filters])

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      targetAudience: '',
      courseLength: '',
      sortBy: 'none',
      sortOrder: 'asc'
    })
  }

  const handleRegister = (programId: string) => {
    setSelectedProgram(programId)
    setIsRegistrationOpen(true)
  }

  const handleViewSchedule = (programId: string) => {
    // TODO: Implement actual course schedule viewing functionality
    // This could open a modal with course dates, times, and availability
    console.log(`Opening schedule for program: ${programId}`)
    alert('課程時間表功能即將推出，請聯繫客服獲取最新課程安排')
  }

  const getDifficultyBadge = (difficulty: string) => {
    const badgeProps = {
      beginner: { variant: 'secondary' as const, label: '初級' },
      intermediate: { variant: 'default' as const, label: '中級' },
      advanced: { variant: 'destructive' as const, label: '進階' }
    }
    return badgeProps[difficulty as keyof typeof badgeProps] || badgeProps.beginner
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">亞馬遜官方培訓</h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            從新手到進階的完整學習路徑，提供實體課程與線上學習雙重選擇，助您在亞馬遜銷售成功。
          </p>
        </div>

        {/* Program Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              課程比較
            </TabsTrigger>
            <TabsTrigger value="offline" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              實體課程
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              線上課程
            </TabsTrigger>
          </TabsList>

          {/* Program Comparison Tab */}
          <TabsContent value="comparison">
            <div className="mb-12">
              <div className="bg-[#dedede] border border-[#bdbdbd] rounded-[30px] px-6 py-4 inline-block mb-6">
                <h1 className="text-[15px] font-normal text-black">
                  Program Comparison by Seller Stage
                </h1>
                <p className="text-[15px] font-normal text-black mt-1">依賣家階段推薦課程</p>
              </div>
              <p className="mb-8 text-lg text-gray-600 max-w-3xl">
                根據您目前的亞馬遜銷售階段，我們為您推薦最適合的培訓課程，助您在每個成長階段都能獲得所需的知識與技能。
              </p>
              <Comparison />
            </div>
          </TabsContent>

          {/* Offline Training Programs */}
          <TabsContent value="offline">
            {/* Header */}
            <div className="mb-12">
              <div className="bg-[#dedede] border border-[#bdbdbd] rounded-[30px] px-6 py-4 inline-block">
                <h1 className="text-[15px] font-normal text-black">
                  Offline Training Program
                </h1>
                <p className="text-[15px] font-normal text-black mt-1">實體課程</p>
              </div>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                選擇最適合您的亞馬遜銷售訓練計畫，從新手到進階賣家，我們提供全方位的學習支援。
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">超過 1,000+</h3>
                    <p className="text-sm text-blue-700">賣家學員</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">85% 出單率</h3>
                    <p className="text-sm text-green-700">30天內成功出單</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-purple-900">實作導向</h3>
                    <p className="text-sm text-purple-700">邊學邊做，立即應用</p>
                  </div>
                </div>
              </div>
            </div>



            {/* Comparison Table */}
            <div className="border border-[#bdbdbd] rounded-[30px] p-8 bg-white">
              {/* Program Headers */}
              <div className="grid grid-cols-4 gap-8 mb-8">
                <div></div> {/* Empty cell for row labels */}
                {filteredAndSortedPrograms.map((program) => (
                  <div key={program.id} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Badge {...getDifficultyBadge(program.difficulty)}>
                        {getDifficultyBadge(program.difficulty).label}
                      </Badge>
                      {program.featured && (
                        <Badge variant="outline" className="ml-2 border-yellow-400 text-yellow-700">
                          推薦
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
                        onClick={() => handleViewSchedule(program.id)}
                        className="w-full"
                        variant="outline"
                      >
                        <CalendarDays className="w-4 h-4 mr-2" />
                        查看課程時間
                      </Button>
                      {program.inviteOnly ? (
                        <Button 
                          disabled
                          className="w-full"
                          variant="secondary"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          僅限邀請
                        </Button>
                      ) : (
                        <Button
                          onClick={() => "location.href='http://www.google.com'"} type="button"
                          className="w-full bg-black hover:bg-gray-800 text-white"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          立即報名
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Show message if no results */}
              {filteredAndSortedPrograms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">沒有找到符合條件的課程</p>
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="mt-4"
                  >
                    清除所有篩選條件
                  </Button>
                </div>
              )}

              {/* Comparison Rows */}
              {filteredAndSortedPrograms.length > 0 && comparisonRows.map((row, index) => (
                <div key={row.key}>
                  <div className="grid grid-cols-4 gap-8 py-6">
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
                    {filteredAndSortedPrograms.map((program) => (
                      <div key={program.id} className="text-[15px] font-medium text-black">
                        {Array.isArray(program[row.key as keyof TrainingProgram]) ? (
                          <div className="space-y-1">
                            {(program[row.key as keyof TrainingProgram] as string[]).map((item, i) => (
                              <p key={i} className="leading-normal">{item}</p>
                            ))}
                          </div>
                        ) : (
                          <p className="leading-normal whitespace-pre-line">
                            {program[row.key as keyof TrainingProgram] as string}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Divider Line (except for last row) */}
                  {index < comparisonRows.length - 1 && (
                    <div className="grid grid-cols-4 gap-8">
                      <div></div>
                      {filteredAndSortedPrograms.length === 1 && (
                        <div className="col-span-1">
                          <div className="h-px bg-[#bdbdbd]"></div>
                        </div>
                      )}
                      {filteredAndSortedPrograms.length === 2 && (
                        <div className="col-span-2 grid grid-cols-2 gap-8">
                          <div className="h-px bg-[#bdbdbd]"></div>
                          <div className="h-px bg-[#bdbdbd]"></div>
                        </div>
                      )}
                      {filteredAndSortedPrograms.length === 3 && (
                        <div className="col-span-3 grid grid-cols-3 gap-8">
                          <div className="h-px bg-[#bdbdbd]"></div>
                          <div className="h-px bg-[#bdbdbd]"></div>
                          <div className="h-px bg-[#bdbdbd]"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">講師資訊</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 資深講師: Moz Yen </li>
                      <li>• 團隊郵箱: twgsonboarding@amazon.com </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Gift className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">團隊保證</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 30天免費重修保障</li>
                      <li>• 專屬學習群組支援</li>
                      <li>• 一對一諮詢時間</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Online Training Programs */}
          <TabsContent value="online">
            <OnlinePrograms onRegister={handleRegister} onViewSchedule={handleViewSchedule} />

            {/* Additional Online Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">彈性學習時間</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 24小時隨時觀看錄播課程</li>
                      <li>• 定期直播互動課程</li>
                      <li>• 手機、電腦跨平台學習</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Target className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">學習成果</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 完成課程獲得認證證書</li>
                      <li>• 線上社群持續交流</li>
                      <li>• 專家定期答疑解惑</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">還有疑問？</h2>
          <p className="text-gray-600 mb-6">
            我們的課程顧問團隊隨時為您解答課程相關問題
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              預約諮詢
            </Button>
            <Button>
              聯繫我們
            </Button>
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {/*selectedProgram && (
        <RegistrationForm
          isOpen={isRegistrationOpen}
          onClose={() => {
            setIsRegistrationOpen(false)
            setSelectedProgram(null)
          }}
          programId={selectedProgram}
          programTitle={
            allPrograms.find(p => p.id === selectedProgram)?.chineseTitle || ''
          }
        />
      )*/}
    </div>
  )
}