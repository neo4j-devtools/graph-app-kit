import React, { Component } from "react";
import TestRenderer from "react-test-renderer";
import {
  SidebarItem,
  SidebarButton,
  SidebarContent,
  SidebarTop,
  SidebarBottom
} from "./SidebarComponents";
import { Sidebar } from "./Sidebar";

const testText = "FooBar";
const TestComponent = () => testText;

describe("SidebarButton component", () => {
  it("renders children", () => {
    const anyTypeOfChild = <TestComponent />;
    const out = TestRenderer.create(
      <SidebarButton>{anyTypeOfChild}</SidebarButton>
    ).root;
    expect(out.findByType(TestComponent).hildren).toEqual([testText]);
  });
});

describe("SidebarContent component", () => {
  it("renders children", () => {
    const anyTypeOfChild = <TestComponent />;
    const out = TestRenderer.create(
      <SidebarContent>{anyTypeOfChild}</SidebarContent>
    ).root;
    expect(out.findByType(TestComponent).children).toEqual([testText]);
  });
});

describe("SidebarBottom component", () => {
  it("only renders children of type SidebarItem", () => {
    const out = TestRenderer.create(
      <SidebarBottom>
        <TestComponent />
        <SidebarItem />
      </SidebarBottom>
    ).root;
    expect(() => out.findByType(TestComponent)).toThrow();
    expect(() => out.findByType(SidebarItem)).not.toThrow();
  });
});

describe("SidebarTop component", () => {
  it("only renders children of type SidebarItem", () => {
    const out = TestRenderer.create(
      <SidebarTop>
        <TestComponent />
        <SidebarItem />
      </SidebarTop>
    ).root;
    expect(() => out.findByType(TestComponent)).toThrow();
    expect(() => out.findByType(SidebarItem)).not.toThrow();
  });
});

describe("SidebarItem component", () => {
  it("only renders children of type SidebarButton", () => {
    const out = TestRenderer.create(
      <SidebarItem>
        <TestComponent />
        <SidebarButton>foo</SidebarButton>
        <SidebarContent>bar</SidebarContent>
      </SidebarItem>
    ).root;
    expect(() => out.findByType(TestComponent)).toThrow();
    expect(() => out.findByType(SidebarButton)).not.toThrow();
    expect(() => out.findByType(SidebarContent)).toThrow();
  });
});
