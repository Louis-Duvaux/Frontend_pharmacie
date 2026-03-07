const BASE_URL = 'https://springajax.herokuapp.com/api'

export async function getMedicaments(page = 0, size = 20) {
    const response = await fetch(`${BASE_URL}/medicaments?page=${page}&size=${size}`)
    if (!response.ok) throw new Error('Erreur lors du chargement des médicaments')
    const data = await response.json()
    return {
        medicaments: data._embedded?.medicaments || [],
        page: data.page,
    }
}

export async function getMedicament(reference) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`)
    if (!response.ok) throw new Error('Médicament introuvable')
    return response.json()
}

export async function createMedicament(medicament) {
    const response = await fetch(`${BASE_URL}/medicaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicament),
    })
    if (!response.ok) {
        if (response.status === 409) {
            throw new Error('Un médicament avec ce nom existe déjà')
        }
        const errorText = await response.text().catch(() => '')
        throw new Error(`Erreur ${response.status} : ${errorText || 'création impossible'}`)
    }
    return response.json()
}

export async function updateMedicament(reference, medicament) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicament),
    })
    if (!response.ok) throw new Error('Erreur lors de la mise à jour du médicament')
    return response.json()
}

export async function patchMedicament(reference, fields) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
    })
    if (!response.ok) throw new Error('Erreur lors de la modification du médicament')
    return response.json()
}

export async function deleteMedicament(reference) {
    const response = await fetch(`${BASE_URL}/medicaments/${reference}`, {
        method: 'DELETE',
    })
    if (!response.ok) throw new Error('Erreur lors de la suppression du médicament')
}

export async function getCategories() {
    const response = await fetch(`${BASE_URL}/categories?size=100`)
    if (!response.ok) throw new Error('Erreur lors du chargement des catégories')
    const data = await response.json()
    return data._embedded?.categories || []
}
