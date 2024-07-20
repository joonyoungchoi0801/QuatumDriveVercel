import React from 'react';
import '../../styles/_common.scss';
import '../../styles/_reset.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <div>{children}</div>;
} // 전체 scss를 위한 layout 컴포넌트 생성
