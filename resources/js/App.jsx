import { useState, useEffect } from 'react';

export default function App({ userId }) {
    const [dispatched, setDispatched] = useState(0);
    const [busy, setBusy] = useState(false);
    const [orders, setOrders] = useState({});

    useEffect(() => {
        const channel = window.Echo.private(`pdf.${userId}`);
        channel.listen('PdfStatusChanged', (e) => {
            setOrders((prev) => ({
                ...prev,
                [e.orderId]: { orderId: e.orderId, status: e.status },
            }));
        });

        return () => {
            channel.stopListening('PdfStatusChanged');
            window.Echo.leave(`pdf.${userId}`);
        };
    }, [userId]);

    const orderList = Object.values(orders);
    const pending = orderList.filter((o) => o.status === 'pending').length;
    const processing = orderList.filter((o) => o.status === 'processing').length;
    const completed = orderList.filter((o) => o.status === 'completed').length;

    const makeRequest = (id) => {
        return axios.post('pdf/build', {
            orderId: `ORD-${Date.now()}-${id}`
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const count = parseInt(e.target.count.value)

        setBusy(true);
        setDispatched((prev) => prev + count);

        const promises = Array.from({ length: count }, (_, i) => makeRequest(i));
        await Promise.all(promises);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="count"
                    min={1}
                    max={1000}
                    defaultValue={50}
                />

                <button
                    type="submit"
                    disabled={busy}
                    className="ml-4 border cursor-pointer"
                >
                    build
                </button>
            </form>

            {dispatched > 0 && (
                <p>
                    Pending: {pending} | Processing: {processing} | Completed: {completed}/{dispatched}
                </p>
            )}
            {orderList.map((order) => (
                <p key={order.orderId}>
                    {order.orderId} — <strong>{order.status}</strong>
                </p>
            ))}
        </div>
    );
}
