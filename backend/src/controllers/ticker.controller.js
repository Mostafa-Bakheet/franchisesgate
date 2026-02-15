import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active news tickers
export const getActiveTickers = async (req, res) => {
  try {
    const tickers = await prisma.newsTicker.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { startDate: { lte: new Date() } },
              { startDate: null }
            ]
          },
          {
            OR: [
              { endDate: { gte: new Date() } },
              { endDate: null }
            ]
          }
        ]
      },
      orderBy: { order: 'asc' }
    });
    
    res.json({ success: true, data: tickers });
  } catch (error) {
    console.error('Get tickers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tickers' });
  }
};

// Admin: Get all tickers
export const getAllTickers = async (req, res) => {
  try {
    const tickers = await prisma.newsTicker.findMany({
      orderBy: { order: 'asc' }
    });
    
    res.json({ success: true, data: tickers });
  } catch (error) {
    console.error('Get all tickers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tickers' });
  }
};

// Admin: Create ticker
export const createTicker = async (req, res) => {
  try {
    const { content, link, bgColor, textColor, order, startDate, endDate } = req.body;
    
    const ticker = await prisma.newsTicker.create({
      data: {
        content,
        link,
        bgColor,
        textColor,
        order: order || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });
    
    res.json({ success: true, data: ticker, message: 'Ticker created successfully' });
  } catch (error) {
    console.error('Create ticker error:', error);
    res.status(500).json({ success: false, message: 'Failed to create ticker' });
  }
};

// Admin: Update ticker
export const updateTicker = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, link, bgColor, textColor, isActive, order, startDate, endDate } = req.body;
    
    const ticker = await prisma.newsTicker.update({
      where: { id },
      data: {
        content,
        link,
        bgColor,
        textColor,
        isActive,
        order,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });
    
    res.json({ success: true, data: ticker, message: 'Ticker updated successfully' });
  } catch (error) {
    console.error('Update ticker error:', error);
    res.status(500).json({ success: false, message: 'Failed to update ticker' });
  }
};

// Admin: Delete ticker
export const deleteTicker = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.newsTicker.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Ticker deleted successfully' });
  } catch (error) {
    console.error('Delete ticker error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete ticker' });
  }
};
