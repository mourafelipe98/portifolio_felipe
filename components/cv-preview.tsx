"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download, Edit, Printer } from "lucide-react"

interface CVPreviewProps {
  profileData: any
  experiences: any[]
  skillCategories: any
  certifications: any[]
  onClose: () => void
  onEdit: () => void
}

export default function CVPreview({
  profileData,
  experiences,
  skillCategories,
  certifications,
  onClose,
  onEdit,
}: CVPreviewProps) {
  const handleDownloadPDF = () => {
    // Implementar geração real de PDF aqui
    // Por enquanto, vamos simular
    const link = document.createElement("a")
    link.href = "#" // Aqui seria a URL do PDF gerado
    link.download = `CV-${profileData.name.replace(/\s+/g, "-")}.pdf`

    // Simular download
    alert("PDF seria baixado aqui. Implementar geração de PDF real.")

    // Para implementação real, você pode usar bibliotecas como:
    // - jsPDF
    // - Puppeteer (server-side)
    // - html2canvas + jsPDF
    // - API externa de geração de PDF
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Preview do Currículo</h2>
            <p className="text-sm text-gray-600">Visualize e baixe seu currículo em PDF</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* CV Content */}
        <div className="flex-1 overflow-auto p-8 bg-white">
          <div className="max-w-2xl mx-auto space-y-6 print:space-y-4">
            {/* Header */}
            <div className="text-center border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{profileData.title}</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <span>{profileData.email}</span>
                <span>{profileData.phone}</span>
                <span>{profileData.location}</span>
                <span>{profileData.linkedin}</span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Resumo Profissional
              </h2>
              <p className="text-gray-700 leading-relaxed">{profileData.summary}</p>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Experiência Profissional
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{exp.period}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {exp.achievements.map((achievement: string, i: number) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                Habilidades & Competências
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(skillCategories).map(([category, data]: [string, any]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-800 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {data.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Certificações</h2>
              <ul className="space-y-1">
                {certifications.map((cert, index) => (
                  <li key={index} className="text-gray-700">
                    • {cert.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .fixed { position: static !important; }
          .bg-black\\/50 { background: none !important; }
          .shadow-2xl { box-shadow: none !important; }
          .rounded-xl { border-radius: 0 !important; }
          .p-4 { padding: 0 !important; }
          .h-\\[90vh\\] { height: auto !important; }
          .max-w-4xl { max-width: none !important; }
          .overflow-hidden { overflow: visible !important; }
          .overflow-auto { overflow: visible !important; }
          .border-b { display: none !important; }
          .bg-gray-50 { background: none !important; }
          .px-6, .py-4 { display: none !important; }
          .print\\:space-y-4 { margin-bottom: 1rem; }
        }
      `}</style>
    </div>
  )
}
