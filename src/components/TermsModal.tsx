import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Términos y Condiciones de Uso del Marketplace</h2>
              
              <div className="space-y-6 text-gray-600">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Aceptación de los Términos</h3>
                  <p>Al acceder y utilizar este marketplace, usted acepta los presentes Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar la plataforma.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Descripción del Servicio</h3>
                  <p>Este marketplace permite a los usuarios publicar, comprar y vender productos y/o servicios directamente entre ellos. La plataforma actúa únicamente como un intermediario tecnológico que facilita el contacto entre comprador y vendedor.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Responsabilidad del Marketplace</h3>
                  <p>El marketplace no garantiza la calidad, legalidad, autenticidad, veracidad o precisión de los productos o servicios ofrecidos por los usuarios. No somos responsables de las transacciones realizadas ni de los productos adquiridos a través de la plataforma.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Relación entre Comprador y Vendedor</h3>
                  <p>Todas las transacciones realizadas a través del marketplace son exclusivamente entre el comprador y el vendedor. El marketplace no interviene ni mediará en disputas o conflictos que puedan surgir entre las partes. Cualquier problema relacionado con la compra, entrega, calidad o cualquier otro aspecto del producto o servicio debe resolverse directamente entre comprador y vendedor.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5. Exclusión de Garantías</h3>
                  <p>El marketplace se exime de cualquier responsabilidad por daños, pérdidas o perjuicios derivados del uso de la plataforma, incluidos, pero no limitados a, fraudes, productos defectuosos, incumplimiento de entrega o problemas derivados de las transacciones.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">6. Uso Adecuado de la Plataforma</h3>
                  <p>Los usuarios se comprometen a utilizar el marketplace de manera legal y ética, absteniéndose de publicar productos ilegales, falsificados, peligrosos o que infrinjan derechos de terceros. Nos reservamos el derecho de eliminar publicaciones que incumplan estos términos.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">7. Modificación de los Términos</h3>
                  <p>El marketplace se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán efectivas a partir de su publicación en la plataforma.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">8. Moderación de Comunidades</h3>
                  <p>Cada comunidad dentro del marketplace es moderada por un administrador designado por dicha comunidad. MercadoComunidad no tiene injerencia en la administración de cada comunidad. Si desea publicar en una comunidad específica, debe ponerse en contacto directamente con el administrador correspondiente a través del correo proporcionado en la misma comunidad.</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">9. Contacto</h3>
                  <p>Para consultas o problemas relacionados con el uso de la plataforma, puede ponerse en contacto con nuestro equipo de soporte a través de los medios indicados en el sitio web.</p>
                </section>

                <p className="text-sm text-gray-500 mt-8">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsModal;