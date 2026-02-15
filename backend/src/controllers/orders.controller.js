import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create new order (from shopping cart)
export const createOrder = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerCompany,
      items,
      notes 
    } = req.body;
    
    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const service = await prisma.service.findUnique({
        where: { id: item.serviceId }
      });
      
      if (!service || !service.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: `Service not found: ${item.serviceId}` 
        });
      }
      
      const quantity = item.quantity || 1;
      const price = service.price;
      totalAmount += price * quantity;
      
      orderItems.push({
        serviceId: item.serviceId,
        quantity,
        price
      });
    }
    
    // Create order with items
    const order = await prisma.serviceOrder.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        customerCompany,
        totalAmount,
        notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            service: true
          }
        }
      }
    });
    
    res.status(201).json({ 
      success: true, 
      data: order, 
      message: 'Order submitted successfully' 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = {};
    if (status) where.status = status;
    
    const orders = await prisma.serviceOrder.findMany({
      where,
      include: {
        items: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Admin: Get single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            service: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user?.id;
    
    const order = await prisma.serviceOrder.update({
      where: { id },
      data: {
        status,
        handledBy: adminId,
        handledAt: new Date()
      },
      include: {
        items: {
          include: {
            service: true
          }
        }
      }
    });
    
    res.json({ success: true, data: order, message: 'Order status updated' });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};

// Admin: Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.serviceOrder.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

// Get orders by customer email
export const getCustomerOrders = async (req, res) => {
  try {
    const { email } = req.params;
    
    const orders = await prisma.serviceOrder.findMany({
      where: { customerEmail: email },
      include: {
        items: {
          include: {
            service: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
