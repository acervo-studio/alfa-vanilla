import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { ESBuildPlugin } from 'esbuild-loader';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';

export const rootDir = path.resolve(__dirname, '../');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    app: `${rootDir}/src/index.js`,
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
          'glslify-loader'
        ]
      },
      {
        exclude: /node_modules/,
        include: path.resolve(rootDir, 'src'),
        test: /\.(ts|js)$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015', // Syntax to compile to (see options below for possible values)
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      Assets: isProduction
        ? path.resolve(rootDir, 'src/assets/')
        : path.resolve(rootDir, 'src/assets/'),
      src: path.resolve(rootDir, 'src'),
    },
  },
  plugins: [
    new ESBuildPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['.*'],
          },
        },
      ],
    }),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: /\.(jpe?g|png|gif|svg)$/i,
    }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.join(rootDir, '/src/index.hbs'),
    }),
  ],
};

export default config;
