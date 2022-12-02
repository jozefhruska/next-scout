export const PAGE_FILE_NAME_REGEX = /^page\.(js|jsx|tsx|mdx)$/;
export const INDEX_FILE_NAME_REGEX = /^index\.(js|jsx|tsx|mdx)$/;

export const ROOT_NODE_NAME = 'ROOT';

export const DEFAULT_APP_FOLDER_PATH = './app/';
export const DEFAULT_PAGES_FOLDER_PATH = './pages/';

// Excluded files directly in the "./pages" directory
export const EXCLUDED_FILES_PAGES_ROOT = ['_app', '_document', '_error'];

// Excluded files anywhere in the "./pages" subtree.
// Fixes an issue with older versions of Next.js where
// middleware could be placed anywhere in the "./pages" subtree
export const EXCLUDED_FILES_ANYWHERE = ['_middleware'];

export const EXCLUDED_FOLDERS = ['api'];
