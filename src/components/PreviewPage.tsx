import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import frontMatter from 'front-matter';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, Image as ImageIcon, Save, RefreshCw } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface ArticleMetadata {
  title?: string;
  date?: string;
  category?: string;
  tags?: string[];
  description?: string;
  coverImage?: string;
  [key: string]: any;
}

const PreviewPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [content, setContent] = useState<string>('');
  const [rawFileContent, setRawFileContent] = useState<string>('');
  const [metadata, setMetadata] = useState<ArticleMetadata | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const [showTipsModal, setShowTipsModal] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      setError('请选择 .md 格式的 Markdown 文件');
      return;
    }

    try {
      const text = await file.text();
      setRawFileContent(text);
      setFileName(file.name);
      
      const parsed = frontMatter<ArticleMetadata>(text);
      setMetadata(parsed.attributes);
      setContent(parsed.body);
      setError(null);
      setImageError(false);
    } catch (err) {
      console.error(err);
      setError('文件解析失败，请检查文件格式');
    }
  };

  const handleReEdit = () => {
    setShowTipsModal(true);
  };

  const confirmReEdit = () => {
    setShowTipsModal(false);
    setContent('');
    setMetadata(null);
    setFileName('');
    setRawFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    console.log('Step 1: Publish button clicked');
    if (!rawFileContent) {
      setError('错误：没有可保存的内容');
      return;
    }

    setIsPublishing(true);

    try {
      // Generate suggested filename from title if available
      let suggestedName = fileName;
      if (metadata?.title) {
        const safeTitle = metadata.title.replace(/[\\/:*?"<>|]/g, '-');
        suggestedName = `${safeTitle}.md`;
      }
      console.log('Step 2: Suggested filename:', suggestedName);

      // @ts-ignore - File System Access API types might not be available
      if (!window.showSaveFilePicker) {
        setError('您的浏览器不支持直接保存文件 (File System Access API)');
        setIsPublishing(false);
        return;
      }

      console.log('Step 3: Opening save file picker...');
      // @ts-ignore - File System Access API
      const handle = await window.showSaveFilePicker({
        suggestedName: suggestedName,
        types: [{
          description: 'Markdown File',
          accept: { 'text/markdown': ['.md'] },
        }],
      });
      console.log('Step 4: File picker handle received', handle);
      
      console.log('Step 5: Creating writable stream...');
      const writable = await handle.createWritable();
      
      console.log('Step 6: Writing content...');
      await writable.write(rawFileContent);
      
      console.log('Step 7: Closing stream...');
      await writable.close();
      
      console.log('Step 8: Save complete. Navigating...');
      // Give user a moment to see the success state
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      console.error('Publish Error:', err);
      setIsPublishing(false);
      if (err.name !== 'AbortError') {
        setError(`发布失败：${err.message || '未知错误'}`);
      } else {
        console.log('User cancelled save');
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header & Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">文章预览助手</h1>
          <p className="text-gray-500">导入 Typora 编写的 Markdown 文件，预览真实效果并发布</p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-100"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Upload Area */}
        {!content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-gray-400 transition-colors cursor-pointer"
            onClick={triggerFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".md"
              className="hidden"
            />
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <Upload size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">点击选择 Markdown 文件</h3>
            <p className="text-gray-500 max-w-md">
              支持 .md 格式文件。文件将完全按照博客样式渲染，包括 Frontmatter 元数据。
            </p>
          </motion.div>
        )}

        {/* Preview Content */}
        {content && metadata && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Action Bar */}
            <div className="sticky top-20 z-40 bg-white/90 backdrop-blur shadow-lg rounded-xl p-4 mb-8 flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{fileName}</div>
                  <div className="text-xs text-gray-500">预览模式</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReEdit}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium flex items-center gap-2 transition-colors"
                >
                  <RefreshCw size={18} />
                  需要修改
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all ${
                    isPublishing 
                      ? 'bg-green-600 text-white cursor-wait' 
                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      正在发布...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      确认发布
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Article Preview (Reused from ArticleDetail) */}
            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Header Preview */}
              <div className="p-8 md:p-12 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {metadata.category && (
                    <span className="bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {metadata.category}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {metadata.title || '无标题'}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
                  {metadata.date && <span>发布于：{new Date(metadata.date).toLocaleDateString()}</span>}
                </div>

                {metadata.description && (
                  <p className="text-xl text-gray-600 mb-6">{metadata.description}</p>
                )}

                {/* Cover Image Preview */}
                {metadata.coverImage && (
                  <div className="rounded-xl overflow-hidden mb-8 bg-gray-100 relative">
                    {!imageError ? (
                      <img
                        src={metadata.coverImage}
                        alt={metadata.title || 'Cover'}
                        className="w-full h-auto"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-gray-100">
                        <ImageIcon size={48} className="mb-3 opacity-50" />
                        <span className="text-sm font-medium">图片加载失败 (检查 URL)</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content Preview */}
              <div className="p-8 md:p-12">
                <div className="prose prose-lg prose-slate max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-gray-900 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-img:rounded-lg prose-img:shadow-md
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-gray-700
                  prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-td:border prose-td:border-gray-300
                  prose-video:rounded-lg prose-video:shadow-md"
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt} loading="lazy" className="w-full h-auto" />
                      ),
                      video: ({ src, children, ...props }) => (
                        <video controls className="w-full rounded-lg" {...props}>
                          {children}
                        </video>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Tags Preview */}
              {metadata.tags && (
                <div className="px-8 md:px-12 pb-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">相关标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {metadata.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </motion.div>
        )}

        {/* Modification Tips Modal */}
        <AnimatePresence>
          {showTipsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4 text-amber-600">
                    <AlertCircle size={28} />
                    <h3 className="text-xl font-bold text-gray-900">修改建议提示</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    请返回 <strong>Typora</strong> 或其他编辑器修改源文件。建议检查以下内容：
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="mt-0.5 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                      <span><strong>Frontmatter 元数据</strong>：确保标题、日期、标签格式正确。</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="mt-0.5 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                      <span><strong>图片链接</strong>：确保图片路径有效，推荐使用网络图床链接。</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="mt-0.5 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                      <span><strong>Markdown 语法</strong>：检查标题层级和代码块闭合。</span>
                    </li>
                  </ul>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowTipsModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={confirmReEdit}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 font-medium transition-colors"
                    >
                      好的，我去修改
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PreviewPage;
