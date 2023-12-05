<input type="text" data-something="example-value" />

const inputElement = document.querySelector('input');
const value = inputElement.dataset.something;

console.log(value); // This will output "example-value"
/////////////////////////////////////////////////////////////////////////////////

<input type="text" data-myarray='["item1", "item2", "item3"]' />


const inputElement = document.querySelector('input');
const dataArray = JSON.parse(inputElement.dataset.myarray);

console.log(dataArray); // This will output the array: ["item1", "item2", "item3"]

///////////////////////////////////////////////////////////////////////////////////

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.dataset.originalValue = input.value;

    input.addEventListener('input', function() {
        if (this.value !== this.dataset.originalValue) {
            // Modification detected
            // You can update a flag or perform other actions
            console.log('Value modified');
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////
<input type="text" data-original-value="initial value" />

const inputElement = document.querySelector('input');
const originalValue = inputElement.getAttribute('data-original-value');

// You can then compare the current value with the original value as needed
if (inputElement.value !== originalValue) {
    console.log('Value has been modified');
}

