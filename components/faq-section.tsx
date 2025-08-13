"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Combien de temps prend une commission ?",
    answer:
      "Le délai varie selon la complexité du projet. Une illustration simple prend 1-2 semaines, tandis qu'une œuvre complexe peut nécessiter 3-4 semaines. Je fournis toujours un délai précis lors de la commande.",
  },
  {
    question: "Quels sont vos tarifs ?",
    answer:
      "Mes tarifs dépendent de la complexité, de la taille et de l'usage prévu. Les portraits commencent à 150€, les illustrations complètes à partir de 300€. Contactez-moi pour un devis personnalisé.",
  },
  {
    question: "Proposez-vous des révisions ?",
    answer:
      "Oui, j'inclus 2-3 révisions dans mes tarifs selon le projet. Des révisions supplémentaires peuvent être facturées séparément. Je m'assure toujours que vous êtes satisfait du résultat final.",
  },
  {
    question: "Dans quels formats livrez-vous ?",
    answer:
      "Je livre en haute résolution (300 DPI) dans les formats PNG, JPG et PSD. Pour les impressions, je peux fournir des fichiers PDF prêts à imprimer selon vos spécifications.",
  },
  {
    question: "Acceptez-vous les projets commerciaux ?",
    answer:
      "Absolument ! Je travaille avec des entreprises, des éditeurs et des créateurs de contenu. Les droits d'usage commercial sont inclus dans mes tarifs professionnels.",
  },
  {
    question: "Comment se déroule le processus de commande ?",
    answer:
      "1) Discussion du projet et devis, 2) Acompte de 50%, 3) Croquis et validation, 4) Réalisation, 5) Révisions si nécessaire, 6) Livraison finale après paiement complet.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Questions Fréquentes
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-medium hover:text-primary">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
