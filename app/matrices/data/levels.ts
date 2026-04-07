export interface MatrixLevelDefinition {
  id: number;
  title: string;
  type: string;
  description: string;
}

export const MATRIX_LEVELS: MatrixLevelDefinition[] = [
  // --- 基礎シリーズ ---
  { id: 1, title: '行列の基本', type: 'matrix_basics', description: '行列の定義・要素・行・列・サイズを理解する' },
  { id: 2, title: '行列の加法・減法', type: 'matrix_arithmetic', description: '同型行列の成分ごとの加減算を学ぶ' },
  { id: 3, title: 'スカラー倍', type: 'scalar_multiplication', description: '行列のすべての成分をスカラー倍する' },
  { id: 4, title: '行列の積', type: 'matrix_multiplication', description: '行と列の内積による行列の掛け算を視覚化する' },

  // --- 行列式・逆行列シリーズ ---
  { id: 5, title: '2×2 行列式', type: 'determinant', description: 'ad - bc による行列式の計算' },
  { id: 6, title: '行列式の幾何学的意味', type: 'determinant_geometric', description: '行列式が面積倍率を表すことを視覚的に理解する' },
  { id: 7, title: '逆行列', type: 'inverse_matrix', description: '2×2 逆行列の公式と計算手順' },
  { id: 8, title: '単位行列と零行列', type: 'identity_matrix', description: '積と和における単位元を学ぶ' },

  // --- 線形変換シリーズ ---
  { id: 9, title: '線形変換の可視化', type: 'linear_transform', description: '行列によるグリッドの変形をリアルタイムで観察する' },
  { id: 10, title: '回転行列', type: 'rotation_matrix', description: '回転行列の構造と角度との関係を学ぶ' },

  // --- 応用シリーズ ---
  { id: 11, title: '連立方程式と行列', type: 'system_of_equations', description: 'Ax = b の形で連立方程式を解く' },
  { id: 12, title: '行列クイズ', type: 'matrices_quiz', description: 'ランダム問題で行列計算を練習する' },
];
