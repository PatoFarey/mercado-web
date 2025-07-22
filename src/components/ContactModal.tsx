import React from 'react';
import { X } from 'lucide-react';
import { Community } from '../types/community';
import { Store } from '../types/store';
import storeData from '../data/stores.json';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  community: Community | null | undefined;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, community }) => {
  if (!isOpen) return null;

  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const storeId = params.get('tienda');

  // Find store data
  const store = storeId ? storeData.stores.find((s: Store) => s.id == storeId) : null;

  // Determine which data to show
  const contactData = store || community;
  const contactType = store ? 'Tienda' : 'Comunidad';

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>

              <div className="space-y-6 text-gray-600">
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contacto {contactType}</h3>
                  <p>
                    Para comunicarte con {contactType.toLowerCase() === 'tienda' ? 'esta tienda' : 'el administrador de esta comunidad'}, envía un correo a{' '}
                    <a
                      href={`mailto:${contactData?.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {contactData?.email}
                    </a>
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Contacto MercadoComunidad</h3>
                  <p>
                    Para consultas o problemas relacionados con el uso de la plataforma, envía un correo a{' '}
                    <a
                      href="mailto:contacto@mercadocomunidad.cl"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      contacto@mercadocomunidad.cl
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactModal;