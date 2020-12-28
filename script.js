let cart = [];
let modalQt = 1;
let modalKey = 0;

//função que reduz o codigo da querySelector
const sl = (el) => document.querySelector(el);//c
const cl = (el) => document.querySelectorAll(el);//cs

//listagem dos lanches
lancheJson.map((item, index) => {
    let lancheItem = sl('.models .lanche-item').cloneNode(true);
    //prencher as informações em lancheItem

    lancheItem.setAttribute('data-key', index);
    lancheItem.querySelector('.lanche-item--img img').src = item.img;
    lancheItem.querySelector('.lanche-item--name').innerHTML = item.name;
    lancheItem.querySelector('.lanche-item--price').innerHTML = 'R$ ' + item.price.toFixed(2);
    lancheItem.querySelector('.lanche-item--desc').innerHTML = item.description;

    lancheItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        // Armazena qual o lanche escolhido
        let key = e.target.closest('.lanche-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;


        sl('.lancheBig img').src = lancheJson[key].img;
        sl('.lancheInfo h1').innerHTML = lancheJson[key].name;
        sl('.lancheInfo--desc').innerHTML = lancheJson[key].description;
        sl('.lancheInfo--actualPrice').innerHTML = 'R$ ' + lancheJson[key].price.toFixed(2);
        sl('.lancheInfo--size.selected').classList.remove('selected');

        cl('.lancheInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = lancheJson[key].sizes[sizeIndex];
        });

        sl('.lancheInfo--qt').innerHTML = modalQt;

        sl('.lancheWindowArea').style.opacity = 0;
        sl('.lancheWindowArea').style.display = 'flex';
        setTimeout(() => {
            sl('.lancheWindowArea').style.opacity = 1;
        }, 200);


    });

    sl('.lanche-area').append(lancheItem);

});

//eventos do MODAL
function closeModal() {
    sl('.lancheWindowArea').style.opacity = 0;
    setTimeout(() => {
        sl('.lancheWindowArea').style.display = 'none';
    }, 500);
}
cl('.lancheInfo--cancelButton,.lancheInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});
sl('.lancheInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt = modalQt - 1;
        sl('.lancheInfo--qt').innerHTML = modalQt;
    }
});

sl('.lancheInfo--qtmais').addEventListener('click', () => {
    modalQt = modalQt + 1;
    sl('.lancheInfo--qt').innerHTML = modalQt;

});
cl('.lancheInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        sl('.lancheInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
// adicionando produtos ao carrinho, armazena qual lanche, tamanho e quantidade
sl('.lancheInfo--addButton').addEventListener('click', () => {

    let tamanho = parseInt(sl('.lancheInfo--size.selected').getAttribute('data-key'));

    let identificador = lancheJson[modalKey].id + '@' + tamanho;

    let key = cart.findIndex((item) => item.identificador == identificador);

    if (key > -1) {
        cart[key].qt = modalQt;
    } else {
        cart.push({

            identificador,
            id: lancheJson[modalKey].id,
            tamanho: tamanho,
            qt: modalQt
        });

    }
    updateCart()
    closeModal();
});

sl('.menu-openner span').addEventListener('click', () => {
    if (cart.length > 0) {
        sl('aside').style.left = '0vw';
    }
});
sl('.menu-closer').addEventListener('click', () => {
    sl('aside').style.left = '100vw';
});

//atualizar carrinho

function updateCart() {

    sl('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        sl('aside').classList.add('show');
        sl('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            // função para retornar os dados do lanche no carrinho
            let lancheItem = lancheJson.find((item) => item.id == cart[i].id);
            subtotal += lancheItem.price * cart[i].qt;

            let cartItem = sl('.models .cart--item').cloneNode(true);


            let lancheTamName;
            switch (cart[i].tamanho) {

                case 0:
                    lancheTamName = 'P';

                    break;

                case 1:
                    lancheTamName = 'M';
                    break;

                case 2:
                    lancheTamName = 'G';
                    break;
            }


            let lancheName = lancheItem.name + ' (' + lancheTamName + ')';


            cartItem.querySelector('img').src = lancheItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = lancheName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener("click", () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener("click", () => {
                cart[i].qt++;
                updateCart();
            });

            sl('.cart').append(cartItem);

        }
        //o desconto sendo de 10%
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        sl('.subtotal span:last-child').innerHTML = 'R$ ' + subtotal.toFixed(2);
        sl('.desconto span:last-child').innerHTML = 'R$ ' + desconto.toFixed(2);
        sl('.total span:last-child').innerHTML = 'R$ ' + total.toFixed(2);

    } else {
        sl('aside').classList.remove('show');
        sl('aside').style.left = '100vw';
    }
}