/**
 * Service API pour la gestion des médicaments de la pharmacie.
 * Utilise l'API REST Spring Data : https://springajax.herokuapp.com/api
 */

const BASE_URL = 'https://pharmacie-backend-4f71.onrender.com/api'

/**
 * Récupère la liste des médicaments (paginée).
 * @param {number} page - Numéro de page (0-indexed)
 * @param {number} size - Nombre d'éléments par page
 * @returns {Promise<{medicaments: Array, page: Object}>}
 */
export async function getMedicaments(page = 0, size = 20) {
    const response = await fetch(`${BASE_URL}/medicaments?page=${page}&size=${size}`)
    if (!response.ok) throw new Error('Erreur lors du chargement des médicaments')
    const data = await response.json()
    return {
        medicaments: data._embedded?.medicaments || [],
        page: data.page,
    }
}

/**
 * Récupère un médicament par sa référence.
 * @param {number} reference - Référence du médicament
 * @returns {Promise<Object>}
 */
export async function getMedicament(reference) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`)
    if (!response.ok) throw new Error('Médicament introuvable')
    return response.json()
}

/**
 * Crée un nouveau médicament.
 * @param {Object} medicament - Données du médicament
 * @returns {Promise<Object>}
 */
export async function createMedicament(medicament) {
    const response = await fetch(`${BASE_URL}/medicaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicament),
    })
    if (!response.ok) throw new Error('Erreur lors de la création du médicament')
    return response.json()
}

/**
 * Met à jour un médicament existant (remplacement complet).
 * @param {number} reference - Référence du médicament
 * @param {Object} medicament - Nouvelles données
 * @returns {Promise<Object>}
 */
export async function updateMedicament(reference, medicament) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicament),
    })
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du médicament')
    return response.json()
}

/**
 * Met à jour partiellement un médicament (PATCH).
 * @param {number} reference - Référence du médicament
 * @param {Object} fields - Champs à modifier
 * @returns {Promise<Object>}
 */
export async function patchMedicament(reference, fields) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
    })
    if (!response.ok) throw new Error('Erreur lors de la modification du médicament')
    return response.json()
}

/**
 * Supprime un médicament.
 * @param {number} reference - Référence du médicament
 * @returns {Promise<void>}
 */
export async function deleteMedicament(reference) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`, {
        method: 'DELETE',
    })
    if (!response.ok) throw new Error('Erreur lors de la suppression du médicament')
}

/**
 * Récupère les catégories disponibles.
 * @returns {Promise<Array>}
 */
export async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories?size=100`)
    if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
    const data = await response.json()
    return data._embedded?.categories || []
}
