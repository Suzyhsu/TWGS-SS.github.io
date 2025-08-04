import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { projectId, publicAnonKey } from '../utils/supabase/info'

interface RegistrationFormProps {
  isOpen: boolean
  onClose: () => void
  programId: string
  programTitle: string
}

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  experience: string
  goals: string
}

export function RegistrationForm({ isOpen, onClose, programId, programTitle }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    experience: 'beginner',
    goals: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return '姓名為必填項目'
    if (!formData.email.trim()) return '電子郵件為必填項目'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return '請輸入有效的電子郵件格式'
    if (!formData.phone.trim()) return '電話號碼為必填項目'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-08513f05/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          programId,
          userData: formData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      setSubmitStatus('success')
      console.log('Registration successful:', result)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          experience: 'beginner',
          goals: ''
        })
        setSubmitStatus('idle')
        onClose()
      }, 2000)

    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage(error instanceof Error ? error.message : '註冊過程中發生錯誤，請稍後再試')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitStatus('idle')
      setErrorMessage('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">報名 {programTitle}</DialogTitle>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">報名成功！</h3>
            <p className="text-gray-600">我們將盡快與您聯繫確認課程詳情</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            <div>
              <Label htmlFor="name">姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="請輸入您的姓名"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="email">電子郵件 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="phone">電話號碼 *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="09XX-XXX-XXX"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="company">公司名稱</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="請輸入公司名稱（選填）"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="experience">亞馬遜銷售經驗</Label>
              <Select 
                value={formData.experience} 
                onValueChange={(value) => handleInputChange('experience', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="請選擇您的經驗程度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">新手（0-6個月）</SelectItem>
                  <SelectItem value="intermediate">中級（6個月-2年）</SelectItem>
                  <SelectItem value="advanced">進階（2年以上）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goals">學習目標</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="請分享您希望通過此課程達成的目標..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                取消
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    提交中...
                  </>
                ) : (
                  '確認報名'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}