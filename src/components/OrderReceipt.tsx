import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import type { Order } from "../types/Order";

interface OrderReceiptProps {
  order: Order;
}

const styles = StyleSheet.create({
  page: {
    width: "80mm",
    padding: "8mm",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#222222",
  },

  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F56600",
    marginBottom: 3,
  },

  restaurantInfo: {
    fontSize: 8,
    marginBottom: 8,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    marginVertical: 7,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },

  infoLabel: {
    width: 65,
  },

  infoValue: {
    flex: 1,
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginBottom: 5,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  itemLeft: {
    flex: 1,
    paddingRight: 5,
  },

  itemName: {
    fontSize: 9,
  },

  itemNote: {
    fontSize: 7,
    color: "#777777",
    marginTop: 2,
  },

  itemQty: {
    width: 25,
    textAlign: "right",
  },

  itemPrice: {
    width: 65,
    textAlign: "right",
  },

  summary: {
    marginTop: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    fontSize: 11,
    fontWeight: "bold",
  },

  paymentSection: {
    marginTop: 8,
  },

  footer: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 8,
  },

  thankYou: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 9,
    fontWeight: "bold",
  },
});

const formatPrice = (price: number | string) => {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function OrderReceipt({ order }: OrderReceiptProps) {
  const amountReceived = Number(order.amountReceived ?? 0);
  const changeAmount = Number(order.changeAmount ?? 0);

  return (
    <Document>
      <Page size={{ width: 226.77, height: "auto" }} style={styles.page}>
        {/* RESTAURANT */}
        <Text style={styles.restaurantName}>WARUNG JINGGA</Text>

        <Text style={styles.restaurantInfo}>
          Kitchen Order · Jl. Melati No. 21, Jakarta
        </Text>

        <View style={styles.divider} />

        {/* ORDER INFO */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>No. Order</Text>
          <Text style={styles.infoValue}>ORD-{order.id}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Meja</Text>
          <Text style={styles.infoValue}>
            {String(order.table.number).padStart(2, "0")}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pelanggan</Text>
          <Text style={styles.infoValue}>
            {order.nameCustomer || "Walk-in"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tanggal</Text>
          <Text style={styles.infoValue}>
            {formatDate(order.createdAt)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Waktu</Text>
          <Text style={styles.infoValue}>
            {formatTime(order.createdAt)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>
            {order.status}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* ITEMS */}
        <View style={styles.itemHeader}>
          <Text style={styles.itemLeft}>ITEM</Text>
          <Text style={styles.itemQty}>QTY</Text>
          <Text style={styles.itemPrice}>TOTAL</Text>
        </View>

        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>
                {item.menu.name}
              </Text>

              {item.note && (
                <Text style={styles.itemNote}>
                  Note: {item.note}
                </Text>
              )}
            </View>

            <Text style={styles.itemQty}>
              {item.quantity}
            </Text>

            <Text style={styles.itemPrice}>
              {formatPrice(
                Number(item.price) * item.quantity
              )}
            </Text>
          </View>
        ))}

        {/* SUMMARY */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>{formatPrice(order.subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Service charge</Text>
            <Text>{formatPrice(order.serviceCharge)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>TOTAL</Text>
            <Text>{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* PAYMENT */}
        {order.status === "PAID" && (
          <View style={styles.paymentSection}>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text>Uang diterima</Text>
              <Text>{formatPrice(amountReceived)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Kembalian</Text>
              <Text>{formatPrice(changeAmount)}</Text>
            </View>
          </View>
        )}

        <Text style={styles.thankYou}>
          Terima kasih telah berkunjung!
        </Text>
      </Page>
    </Document>
  );
}