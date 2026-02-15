import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active services with pricing
export const getActiveServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

// Get single service by slug
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { slug }
    });
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service' });
  }
};

// Admin: Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });
    
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

// Admin: Create service
export const createService = async (req, res) => {
  try {
    const { name, slug, description, shortDesc, price, oldPrice, icon, image, bgColor, order, features } = req.body;
    
    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        icon,
        image,
        bgColor,
        order: order || 0,
        features: features || []
      }
    });
    
    res.json({ success: true, data: service, message: 'Service created successfully' });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
};

// Admin: Update service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, shortDesc, price, oldPrice, icon, image, bgColor, isActive, order, features } = req.body;
    
    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        shortDesc,
        price: price ? parseFloat(price) : undefined,
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        icon,
        image,
        bgColor,
        isActive,
        order,
        features: features || []
      }
    });
    
    res.json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
};

// Admin: Delete service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.service.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
};
