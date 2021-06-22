<template>
    <div>
        <div v-if="!showOrder">
            <v-btn
                title="Закрыть"
                class="mb-9"
                outlined
                icon
                large
                @click="$emit('close-orders')"
            >
                <v-icon>$arrowLeft</v-icon>
            </v-btn>
            <h2 class="mb-6" style="font-size: 23px;">Мои заказы</h2>

            <v-list v-if="formattedOrders.length">
                <v-list-item
                    v-for="order of formattedOrders"
                    :key="order.id"
                    @click="selectOrder(order.id)"
                >
                    {{ order.date }}
                    <div class="ml-auto">
                        <span v-if="order.oneClick">в один клик</span>
                        <span v-else-if="order.summa">{{ order.summa }} руб.</span>
                    </div>
                </v-list-item>
            </v-list>
            <div v-else>Тут будут отображаться ваши заказы.</div>
        </div>
        <div v-else>
            <v-btn
                class="mb-9"
                title="Закрыть"
                outlined
                icon
                large
                @click="showOrder = false"
            >
                <v-icon>$arrowLeft</v-icon>
            </v-btn>
            <user-order
                :order="formattedOrders.find((item) => item.id === selectedOrder)"
            />
        </div>
    </div>
</template>
<script>

export default {
    data() {
        return { orders: [], showOrder: false, selectedOrder: '' };
    },
    computed: {
        formattedOrders() {
            if (!this.orders || !this.orders.length) {
                return [];
            } else {
                return this.orders.map(order => {
                    const dateCreated = new Date(order.createdAt);
                    const day = dateCreated.getDate();
                    const mon = dateCreated.getMonth();
                    const hour = dateCreated.getHours();
                    const min = dateCreated.getMinutes();
                    order.date = `${(day > 9 ? '' : '0') + day}.${
                        (mon > 9 ? '' : '0') + mon
                    }.${dateCreated.getFullYear()} ${(hour > 9 ? '' : '0') + hour}:${
                        (min > 9 ? '' : '0') + min
                    }`;
                    return order;
                });
            }
        },
    },
    // components: { Order },
    async mounted() {
        await this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            this.orders = await this.$strapi.$orders.find({
                _sort: 'createdAt:DESC',
            });
        },
        selectOrder(id) {
            this.showOrder = true;
            this.selectedOrder = id;
        },
    },
};
</script>
