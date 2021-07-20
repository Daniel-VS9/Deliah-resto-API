const paymentMethods = [
    {
        name : 'cash'
    },
    {
        name: 'card'
    }
]

function getPaymentMethods() {
    return paymentMethods
}

function addPaymenMethod(name) {
    const method = {name}
    paymentMethods.push(method)
}

function deletePaymentMethod(name) {
    index = paymentMethods.findIndex(p => p.name == name)
    index >= 0 && paymentMethods.splice(index, 1)
}

function updatePaymentMethod(index, name) {
    paymentMethods[index].name = name
}

module.exports = {getPaymentMethods, addPaymenMethod, deletePaymentMethod, updatePaymentMethod}