"use client"

import React, { useState, useRef } from "react"
import { X, Upload, Trash2, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedSpotlightButton } from "@/components/enhanced-spotlight-button"

interface CommissionFormProps {
  isOpen: boolean
  onClose: () => void
}

export function CommissionForm({ isOpen, onClose }: CommissionFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [processingFiles, setProcessingFiles] = useState(false)
  const [selectedCommissionType, setSelectedCommissionType] = useState("")
  const [showRules, setShowRules] = useState(false)

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newErrors: string[] = []
    const validFiles: File[] = []

    files.forEach((file, index) => {
      // Check file size (15MB = 15 * 1024 * 1024 bytes)
      if (file.size > 15 * 1024 * 1024) {
        newErrors.push(`${file.name}: Taille maximum 15MB`)
        return
      }

      // Check file type (images only)
      if (!file.type.startsWith('image/')) {
        newErrors.push(`${file.name}: Seules les images sont acceptées`)
        return
      }

      // Check total file count (max 5)
      if (selectedFiles.length + validFiles.length >= 5) {
        newErrors.push(`Maximum 5 images autorisées`)
        return
      }

      validFiles.push(file)
    })

    // Reset arrays and add new files
    setSelectedFiles(validFiles)
    setFileErrors(newErrors)
    setProcessingFiles(validFiles.length > 0)
    
    // Create previews
    const newPreviews: string[] = new Array(validFiles.length)
    let previewsProcessed = 0
    
    validFiles.forEach((file, index) => {
      // Create preview
      const previewReader = new FileReader()
      previewReader.onload = (e) => {
        if (e.target?.result) {
          newPreviews[index] = e.target.result as string
          previewsProcessed++
          if (previewsProcessed === validFiles.length) {
            setFilePreviews([...newPreviews])
            setProcessingFiles(false)
          }
        }
      }
      previewReader.readAsDataURL(file)
    })
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
    setFileErrors([])
    setProcessingFiles(false)
    
    // Clear the file input to reflect the changes
    const fileInput = document.querySelector('input[name="referenceImages"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!formRef.current) {
      setSubmitError('Erreur de formulaire')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    // Use FormData for Basin form submission
    const formData = new FormData(formRef.current)
    
    // Add selected files to FormData for Basin
    selectedFiles.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('https://usebasin.com/f/8b994ffed28e', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        setIsSubmitted(true)
      } else {
        const errorText = await response.text()
        console.error('Form submission error:', { status: response.status, errorText })
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
              Votre demande de commission a été envoyée avec succès. Après envoi de la demande, un devis avec la facture exacte vous sera transmis.
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

  // Rules popup
  if (showRules) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Règles et Conditions
              <button
                onClick={() => setShowRules(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">ÉTAPE 1 : SOYEZ CLAIR</h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                <li>Peu importe si votre personnage est une création originale, issu d'une licence spécifique ou autre : Précisez le</li>
                <li>Commencez par donner son nom, sa tenue, sa taille, sa corpulence ou tout autre particularité utile à savoir pour le painting.</li>
                <li>Ajoutez des références : Par exemple une référence de pose, 3 du personnages et des idées et une de l'environnement.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">ÉTAPE 2 : COOPÉRATION</h3>
              <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                <li>Il se peut qu'au cours du processus, certains éléments que vous souhaitez ne soient pas compris. Gardez simplement en tête que je ne peux pas lire dans vos pensées. Malgré tout, je ferai de mon mieux pour obtenir le résultat que vous voulez</li>
                <li>Le travail peut prendre du temps, merci de faire preuve de patience.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">ÉTAPE 3 : CONNAÎTRE LES RÈGLES</h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-2">Paiement :</p>
                  <p className="text-sm text-muted-foreground">Le paiement se fait à l'avance et uniquement par virement bancaire ou Paypal.</p>
                </div>
                
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-sm font-medium mb-2 text-red-400">Remboursement :</p>
                  <p className="text-sm text-muted-foreground">Aucun remboursement n'est possible lorsque le painting est entamé, assurez-vous donc bien de votre décision avant d'acheter.</p>
                </div>
                
                <ul className="space-y-2 text-sm text-muted-foreground ml-4 list-disc">
                  <li>Les retakes sont acceptés dans la limite du raisonnable.</li>
                  <li>Vous pouvez publier mes images n'importe où, mais vous devez me créditer.</li>
                  <li>Je commence à dessiner uniquement après réception du paiement.</li>
                  <li>Je m'accorde le droit de décliner toute demande si elle ne me convient pas.</li>
                </ul>
              </div>
            </div>

            <EnhancedSpotlightButton
              onClick={() => setShowRules(false)}
              className="w-full py-0.5 text-lg"
            >
              J'ai compris
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
            Commander une Commission
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </CardTitle>
          <CardDescription>
            Remplissez ce formulaire pour commander votre illustration personnalisée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
              <label htmlFor="commissionType" className="text-sm font-medium text-primary">
                Type de Commission *
              </label>
              <select 
                id="commissionType"
                name="commissionType"
                required
                value={selectedCommissionType}
                onChange={(e) => setSelectedCommissionType(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Sélectionner le type</option>
                <option value="Concept Art">Concept Art (100~300 €)</option>
                <option value="Valorant Style">Valorant Style (100~300 €)</option>
                <option value="Portrait">Portrait (200~400 €)</option>
                <option value="Splash Art">Splash Art (400~800 €)</option>
              </select>
            </div>

            {/* Commission Type Examples */}
            {selectedCommissionType && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="text-sm font-medium mb-3 text-primary">Exemples pour {selectedCommissionType} :</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedCommissionType === "Concept Art" && (
                    <>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-1.jpg" alt="Concept Art Example 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-2.jpg" alt="Concept Art Example 2" className="w-full h-full object-cover" />
                      </div>
                    </>
                  )}
                  {selectedCommissionType === "Valorant Style" && (
                    <>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-3.jpg" alt="Valorant Style Example 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-4.jpg" alt="Valorant Style Example 2" className="w-full h-full object-cover" />
                      </div>
                    </>
                  )}
                  {selectedCommissionType === "Portrait" && (
                    <>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-5.jpg" alt="Portrait Example 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-6.jpg" alt="Portrait Example 2" className="w-full h-full object-cover" />
                      </div>
                    </>
                  )}
                  {selectedCommissionType === "Splash Art" && (
                    <>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/artwork-7.jpg" alt="Splash Art Example 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-background/50">
                        <img src="/images/shanks.jpg" alt="Splash Art Example 2" className="w-full h-full object-cover" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}


            <div className="space-y-2">
              <label htmlFor="deadline" className="text-sm font-medium text-primary">
                Délai Souhaité *
              </label>
              <select 
                id="deadline"
                name="deadline"
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Sélectionner le délai</option>
                <option value="1 semaine (+300€)">1 semaine (+300€)</option>
                <option value="2 semaines (+200€)">2 semaines (+200€)</option>
                <option value="3 semaines (+100€)">3 semaines (+100€)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-primary">
                Description du Projet *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Décrivez en détail votre projet : personnages, style souhaité, références, couleurs, ambiance, etc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="references" className="text-sm font-medium text-primary">
                Références / Inspiration
              </label>
              <textarea
                id="references"
                name="references"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Partagez des liens vers des images de référence, des styles qui vous inspirent, ou tout autre élément utile"
              />
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-primary">
                Options Supplémentaires
              </label>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="background"
                    name="background"
                    value="Background (~100€)"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="background" className="text-sm text-muted-foreground">
                    Background (~100€)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="additionalCharacter"
                    name="additionalCharacter"
                    value="Personnage supplémentaire (~200€)"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="additionalCharacter" className="text-sm text-muted-foreground">
                    Personnage supplémentaire (~200€)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="commercialUse"
                    name="commercialUse"
                    value="Utilisation commerciale (+50% TTC)"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="commercialUse" className="text-sm text-muted-foreground">
                    Utilisation commerciale (+50% TTC)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="privateCommission"
                    name="privateCommission"
                    value="Commission privé* (l'œuvre ne sera jamais publié sur mes réseaux) (+50% TTC)"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="privateCommission" className="text-sm text-muted-foreground">
                    Commission privé* (l'œuvre ne sera jamais publié sur mes réseaux) (+50% TTC)
                  </label>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-primary">
                Images de Référence (Max 5 images, 15MB chacune)
              </label>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors relative">
                <div className="text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Glissez vos images ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF jusqu'à 15MB • Maximum 5 images
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  name="referenceImages"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelection}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={selectedFiles.length >= 5}
                />
              </div>

              {/* File Errors */}
              {fileErrors.length > 0 && (
                <div className="space-y-1">
                  {fileErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red-500">{error}</p>
                  ))}
                </div>
              )}

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-primary">Images sélectionnées :</h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center overflow-hidden">
                            {filePreviews[index] ? (
                              <img 
                                src={filePreviews[index]} 
                                alt={file.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Upload className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedFiles.length}/5 images • {selectedFiles.reduce((acc, file) => acc + file.size, 0) > 0 && `Total: ${formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}`}
                  </p>
                </div>
              )}
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
              
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowRules(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Règles et conditions
                </button>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <EnhancedSpotlightButton
              type="submit"
              disabled={isSubmitting || !acceptedTerms || processingFiles}
              className={`w-full py-0.5 text-lg transition-opacity ${
                !acceptedTerms || processingFiles ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? "Envoi en cours..." : processingFiles ? "Traitement des images..." : "Envoyer la Demande"}
            </EnhancedSpotlightButton>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}