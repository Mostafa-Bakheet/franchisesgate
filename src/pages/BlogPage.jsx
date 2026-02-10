import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { BookOpen, TrendingUp, Award, ArrowLeft, Calendar, Clock } from 'lucide-react';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');

  const articles = [
    {
      id: 1,
      title: 'الدليل الشامل للاستثمار في الامتيازات التجارية 2025',
      excerpt: 'دليلك الشامل لعام 2025 حول الاستثمار في الامتيازات التجارية في السعودية. تعلم كيف تختار الفرنشايز المناسب، التكاليف، التراخيص، ونصائح النجاح.',
      image: '/blog/guide-thumb.jpg',
      category: 'دليل شامل',
      readTime: '12 دقيقة',
      date: '9 فبراير 2025',
      slug: 'franchise-investment-guide',
      icon: BookOpen,
      featured: true
    },
    {
      id: 2,
      title: 'فرنشايز vs مشروع مستقل: أيهما أفضل لك؟',
      excerpt: 'مقارنة شاملة بين الامتياز التجاري والمشروع المستقل. تعلم الفروقات في التكاليف، المخاطر، العوائد، وأيهما يناسبك كمستثمر.',
      image: '/blog/comparison-thumb.jpg',
      category: 'مقارنة',
      readTime: '8 دقائق',
      date: '8 فبراير 2025',
      slug: 'franchise-vs-independent',
      icon: TrendingUp,
      featured: false
    },
    {
      id: 3,
      title: 'قصة نجاح: من فرع واحد إلى امتياز وطني',
      excerpt: 'اقرأ قصة نجاح أحمد الذي بدأ بفرع واحد وصار صاحب امتياز تجاري ناجح بـ4 فروع. تعرف على رحلته والنصائح التي يقدمها.',
      image: '/blog/success-thumb.jpg',
      category: 'قصة نجاح',
      readTime: '10 دقائق',
      date: '7 فبراير 2025',
      slug: 'success-story-ahmed',
      icon: Award,
      featured: false
    }
  ];

  const categories = [
    { name: 'الكل', count: articles.length },
    { name: 'دليل شامل', count: articles.filter(a => a.category === 'دليل شامل').length },
    { name: 'مقارنة', count: articles.filter(a => a.category === 'مقارنة').length },
    { name: 'قصة نجاح', count: articles.filter(a => a.category === 'قصة نجاح').length }
  ];

  // Filter articles based on active category
  const filteredArticles = activeCategory === 'الكل' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const featuredArticle = filteredArticles.find(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="المدونة | دليل الاستثمار في الفرنشايز"
        description="اقرأ أحدث المقالات والأدلة حول الاستثمار في الامتيازات التجارية في السعودية. نصائح، قصص نجاح، ومقارنات شاملة."
        keywords="مدونة فرنشايز, دليل استثمار, نصائح الفرنشايز, قصص نجاح, استثمار السعودية"
        canonical="/blog"
      />
      <Navigation />

      {/* Header */}
      <section className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-primary/20 text-dark-1 px-4 py-1 rounded-full text-sm font-medium mb-4">
              المدونة
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-1 mb-4">
              دليلك الشامل للاستثمار في الامتيازات التجارية
            </h1>
            <p className="text-dark-2 text-lg max-w-2xl mx-auto">
              اقرأ أحدث المقالات، الأدلة، وقصص النجاح في عالم الفرنشايز
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.name
                    ? 'bg-dark-1 text-white' 
                    : 'bg-white text-dark-1 hover:bg-primary/20'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {featuredArticle && (
            <Link
              to={`/blog/${featuredArticle.slug}`}
              className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-80 bg-primary/20 flex items-center justify-center">
                  <featuredArticle.icon className="w-24 h-24 text-primary/40" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block bg-primary/20 text-dark-1 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit">
                    {featuredArticle.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-dark-1 mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-dark-2 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-dark-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredArticle.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredArticle.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-dark-1 mb-8">
            {activeCategory === 'الكل' ? 'جميع المقالات' : `مقالات ${activeCategory}`}
          </h2>
          {regularArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map(article => {
                const Icon = article.icon;
                return (
                  <Link
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="h-48 bg-primary/20 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-primary/40" />
                    </div>
                    <div className="p-6">
                      <span className="inline-block bg-primary/20 text-dark-1 px-3 py-1 rounded-full text-xs font-medium mb-3">
                        {article.category}
                      </span>
                      <h3 className="text-xl font-bold text-dark-1 mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-dark-2 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-dark-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-2/60">لا توجد مقالات في هذا القسم</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-dark-1 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              احصل على أحدث المقالات، النصائح، وفرص الاستثمار مباشرة إلى بريدك
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-5 py-3 rounded-full text-dark-1 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-dark-1 px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
