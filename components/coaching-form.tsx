"use client"

import React, { useState, useRef } from "react"
import { X, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

interface CoachingFormProps {
  isOpen: boolean
  onClose: () => void
}

export function CoachingForm({ isOpen, onClose }: CoachingFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [selectedDay, setSelectedDay] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  // Get current year
  const currentYear = new Date().getFullYear()

  // Months in French
  const months = [
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" }
  ]

  // Available time slots
  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ]

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!formRef.current) {
      setSubmitError('Erreur de formulaire')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    const formData = new FormData(formRef.current)
    
    // Add selected date and time to form data
    const formattedDate = selectedDay && selectedMonth ? `${selectedDay}/${selectedMonth}/${currentYear}` : ''
    formData.append('selectedDate', formattedDate)
    formData.append('selectedTime', selectedTime)

    try {
      const response = await fetch('https://formspree.io/f/mzzvolne', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const errorData = await response.json()
        console.error('Form submission error:', { status: response.status, errorData })
        setSubmitError('Erreur: veuillez me contacter par mes réseaux/emails')
      }
    } catch (error) {
      console.error('Network error:', error)
      setSubmitError('Erreur: veuillez me contacter par mes réseaux/emails')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Merci !
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Merci de votre application, je vous contacterai dans les plus brefs délais pour confirmer votre session de coaching !
            </p>
            <EnhancedSpotlightButton
              onClick={onClose}
              className="w-full mt-4"
            >
              Fermer
            </EnhancedSpotlightButton>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Réserver une Session de Coaching
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour réserver votre session de coaching personnalisée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-primary">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Votre prénom"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-primary">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">
                Adresse Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="votre@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="coachingType" className="text-sm font-medium text-primary">
                Type de Session *
              </label>
              <select 
                id="coachingType"
                name="coachingType"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Sélectionner le type</option>
                <option value="Session 1h (60€)">Session 1h (60€)</option>
                <option value="Pack 6 sessions (450€)">Pack 6 sessions (450€)</option>
                <option value="Mentorat mensuel (600€/mois)">Mentorat mensuel (600€/mois)</option>
              </select>
            </div>

            {/* Calendar Interface */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-primary flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Jours Disponibles *
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Date souhaitée ({currentYear})
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="day" className="text-xs text-muted-foreground">Jour</label>
                      <input
                        id="day"
                        name="day"
                        type="number"
                        min="1"
                        max="31"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label htmlFor="month" className="text-xs text-muted-foreground">Mois</label>
                      <select
                        id="month"
                        name="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Mois</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="preferredTime" className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure souhaitée
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Sélectionner une heure</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong>Note :</strong> Les sessions se déroulent en ligne via Discord. 
                  Je vous contacterai pour confirmer la disponibilité du créneau sélectionné.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-medium text-primary">
                Votre Expérience Artistique *
              </label>
              <select 
                id="experience"
                name="experience"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Sélectionner votre niveau</option>
                <option value="Débutant">Débutant (0-1 an)</option>
                <option value="Intermédiaire">Intermédiaire (1-3 ans)</option>
                <option value="Avancé">Avancé (3-5 ans)</option>
                <option value="Expert">Expert (5+ ans)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="goals" className="text-sm font-medium text-primary">
                Objectifs de Coaching *
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Décrivez vos objectifs : améliorer votre technique, développer votre style, travailler sur un projet spécifique, etc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-primary">
                Description / Questions Spécifiques
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Partagez vos questions spécifiques, défis actuels ou tout autre détail qui pourrait m'aider à personnaliser la session"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
                <label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-relaxed">
                  J'ai pris connaissance des règles et informations.
                </label>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <EnhancedSpotlightButton
              type="submit"
              disabled={isSubmitting || !acceptedTerms || !selectedDay || !selectedMonth || !selectedTime}
              className={`w-full py-0.5 text-lg transition-opacity ${
                !acceptedTerms || !selectedDay || !selectedMonth || !selectedTime ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer la Demande"}
            </EnhancedSpotlightButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}